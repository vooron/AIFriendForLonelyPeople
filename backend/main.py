from dialogue_engine import DialogueEngine
from voice import SpeakerOpenAi


persons = [
    {"name": "Bob", "age": 20, "gender": "male", "voice": "fable"},
    {"name": "Michael", "age": 25, "gender": "male", "voice": "onyx"},
    {"name": "Kate", "age": 30, "gender": "female", "voice": "nova"}
]


person_info_pattern = "Your name is {name} ({age} y.o. {gender})"


# roles
sarcastic_role_prompt = "You are a sarcastic person."

supportive_role_prompt = "You are a supportive and friendly person."

psychologist_role_prompt = "You are a professional psychologist."

gangsta_role_prompt = "You are a gangsta from London, speaking cockney."  # gangsta


def get_prompt(role: str, person: dict):
    return role + " " + person_info_pattern.format(**person)

person = persons[0]
api_key = "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"

engine = DialogueEngine(
    api_key,
    get_prompt(sarcastic_role_prompt, person)
)

speaker = SpeakerOpenAi(api_key, person["voice"])

text = engine.add_message("Hi, my name is Robert. Can you tell me a little about yourself?")
print("Response:", text)
speaker.say(text)

text = engine.add_message("I just want to get some new friend")
print("Response:", text)
speaker.say(text)


text = engine.add_message("Are you AI?")
print("Response:", text)
speaker.say(text)

text = engine.add_message("Привіт, козаче! Як ся маєш?")
print("Response:", text)
speaker.say(text)


