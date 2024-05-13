from flask import Flask, request, jsonify, Response
from flask_cors import CORS

from backend.dialogue_engine import DialogueEngine, DialogueManager
from backend.voice import SpeakerOpenAi

app = Flask(__name__)
CORS(app)


openai_api_key = "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"

dialogue_manager = DialogueManager({
    "Bob": DialogueEngine(
        openai_api_key, "You are a gangsta from London, speaking cockney. Your name is Bob (20 y.o. male)"),
    "Tom": DialogueEngine(
        openai_api_key, "You are a sarcastic person with passive aggression in your speech. Your name is Tom (20 y.o. male)"),
    "Michael": DialogueEngine(
        openai_api_key, "You are a supportive and friendly person. Your name is Tom (25 y.o. male)"),
    "Kate": DialogueEngine(
        openai_api_key, "You are a professional psychologist. Your name is Tom (30 y.o. female)")
})

voice_mapping: dict[str, SpeakerOpenAi] = {
    "Bob": SpeakerOpenAi(openai_api_key, "fable"),
    "Tom": SpeakerOpenAi(openai_api_key, "shimmer"),
    "Michael": SpeakerOpenAi(openai_api_key, "onyx"),
    "Kate": SpeakerOpenAi(openai_api_key, "nova")
}


@app.route('/messages/<username>', methods=["GET"])
def index():
    data = request.get_json(force=True)
    recipient = data.get("recipient")
    message = data.get("message")

    if not message:
        return jsonify({"error": "empty message"}), 400

    try:
        response = dialogue_manager.add_message(recipient, message)
        voice_mapping[recipient].say(response)
        return response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


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
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
