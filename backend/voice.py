from typing import Literal

import pyttsx3

# engine = pyttsx3.init()
# engine.setProperty('voice', "com.apple.ttsbundle.Daniel-premium")
# engine.setProperty('volume', 0.8)
# engine.setProperty('rate', 220)
#
# engine.say("I will speak this text")
# engine.runAndWait()


class SpeakerApple:
    def __init__(self, voice: dict):
        self.engine = pyttsx3.init()
        for key, val in voice.items():
            self.engine.setProperty(key, val)

    def say(self, text: str):
        self.engine.say(text)
        self.engine.runAndWait()



from openai import OpenAI
import soundfile as sf
import sounddevice as sd
import io


class SpeakerOpenAi:

    model = "tts-1"

    def __init__(self, api_key: str, voice: Literal["alloy", "echo", "fable", "onyx", "nova", "shimmer"]):
        self.client = OpenAI(api_key=api_key)
        self.voice = voice

    def say(self, text: str):
        response = self.client.audio.speech.create(
          model=self.model,
          voice=self.voice,
          input=text
        )

        buffer = io.BytesIO()
        for chunk in response.iter_bytes(chunk_size=4096):
          buffer.write(chunk)
        buffer.seek(0)

        with sf.SoundFile(buffer, 'r') as sound_file:
          data = sound_file.read(dtype='int16')
          sd.play(data, sound_file.samplerate)
          sd.wait()

    def stream_bytes(self, text: str):
        response = self.client.audio.speech.create(
            model=self.model,
            voice=self.voice,
            response_format="opus",
            input=text
        )

        for chunk in response.iter_bytes(chunk_size=4096):
            yield chunk


# https://github.com/CorentinJ/Real-Time-Voice-Cloning

