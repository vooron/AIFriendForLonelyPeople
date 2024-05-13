import requests

r = requests.post(
    "http://127.0.0.1:5000/message",
    json={
        "recipient": "Bob",
        "message": "Hi"
    })

print(r.status_code)
print(r.text)
