from openai import OpenAI


class DialogueEngine:
    keep_history_messages = 20

    history: list
    role_description: dict

    client: OpenAI

    def __init__(self, api_key: str, role_prompt: str):
        self.client = OpenAI(api_key=api_key)
        self.history = []
        self.role_description = {
            "role": "system",
            "content": role_prompt
        }

    def add_message(self, message: str) -> str:

        self.history.append({
            "role": "user",
            "content": message
        })

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                self.role_description,
                *self.history
            ],
            temperature=1,
            max_tokens=256,
            top_p=0.66,
            frequency_penalty=0,
            presence_penalty=0
        )

        self.history.append({
            "role": response.choices[0].message.role,
            "content": response.choices[0].message.content
        })

        if len(self.history) > self.keep_history_messages:
            self.history = self.history[2:]

        return response.choices[0].message.content


class DialogueManager:
    dialogs_mapping: dict[str, DialogueEngine]

    def __init__(self, engines: dict[str, DialogueEngine]):
        self.dialogs_mapping = engines

    def add_message(self, recipient: str, message: str) -> str:
        engine = self.dialogs_mapping[recipient]
        if not engine:
            raise Exception("Recipient not found")

        return engine.add_message(message)



