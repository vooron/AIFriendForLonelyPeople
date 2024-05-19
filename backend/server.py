from flask import Flask, request, jsonify, Response
from flask_cors import CORS

from backend.dialogue_engine import DialogueEngine, DialogueManager
from backend.voice import SpeakerOpenAi

app = Flask(__name__)
CORS(app)


openai_api_key = "<api key>"


dialogue_manager = DialogueManager({
    "Bob": DialogueEngine(
        openai_api_key, "You are a gangsta from London, speaking cockney. Your name is Bob (20 y.o. male)"),
    "Tom": DialogueEngine(
        openai_api_key, "You are a sarcastic person with passive aggression in your speech. Your name is Tom (20 y.o. male)"),
    "Michael": DialogueEngine(
        openai_api_key, "You are a supportive and friendly person. Your name is Tom (25 y.o. male)"),
    "Kate": DialogueEngine(
        openai_api_key, "You are a professional psychologist. Your name is Tom (30 y.o. female)"),
    "Sirko": DialogueEngine(
        openai_api_key, "Ти український козак. Воля для тебе то найбільший скарб, а Україна — мати.",
        model="ft:gpt-3.5-turbo-0125:personal:kozak-test:9PHKIrvI"),
    "Mamai": DialogueEngine(
        openai_api_key, "Ти український козак.",
        model="ft:gpt-3.5-turbo-0125:personal:kozak-new:9QcnRcsp")
})

voice_mapping: dict[str, SpeakerOpenAi] = {
    "Bob": SpeakerOpenAi(openai_api_key, "fable"),
    "Tom": SpeakerOpenAi(openai_api_key, "shimmer"),
    "Michael": SpeakerOpenAi(openai_api_key, "onyx"),
    "Kate": SpeakerOpenAi(openai_api_key, "nova"),
    "Sirko": SpeakerOpenAi(openai_api_key, "onyx"),
    "Mamai": SpeakerOpenAi(openai_api_key, "onyx"),
}



@app.route('/message_stream', methods=["POST"])
def stream_bytes():
    data = request.get_json(force=True)
    recipient = data.get("recipient")
    message = data.get("message")

    if not message:
        return jsonify({"error": "empty message"}), 400

    try:
        response = dialogue_manager.add_message(recipient, message)
        return Response(voice_mapping[recipient].stream_bytes(response), mimetype='audio/mp3')
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400


@app.route('/contacts', methods=["POST"])
def add_contact():
    data = request.get_json(force=True)

    dialogue_manager.add_dialogue(data['name'], DialogueEngine(
        openai_api_key, data['role']
    ))

    voice_mapping[data['name']] = SpeakerOpenAi(openai_api_key, data['voice'])
    return "", 200


if __name__ == '__main__':
    app.run(debug=True, port=5001)
