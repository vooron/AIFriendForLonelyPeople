import React, {useState} from 'react';
import style from "./DialogPage.module.css"
import {Link, useParams} from "react-router-dom";
import {contacts} from "../constants";


const SpeachSvg = () => {
  return (
    <svg
      width="400"
      height="200"
      viewBox="0 0 400 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wave */}
      <path
        d="M 0 100 Q 50 50 100 100 T 200 100 T 300 100 T 400 100"
        stroke="#007bff"
        strokeWidth="2"
        fill="transparent"
      >
        {/* Animation */}
        <animate
          attributeName="d"
          dur="1.4s"
          repeatCount="indefinite"
          values="
            M 0 100 Q 50 80 100 100 T 200 100 T 300 100 T 400 100;
            M 0 100 Q 50 120 100 100 T 200 100 T 300 100 T 400 100;
            M 0 100 Q 50 50 100 100 T 200 100 T 300 100 T 400 100;
          "
        />
      </path>

      <path
        d="M 0 100 Q 50 20 100 100 T 200 100 T 300 100 T 400 100"
        stroke="#007bff99"
        strokeWidth="2"
        fill="transparent"
      >
        {/* Animation */}
        <animate
          attributeName="d"
          dur="2s"
          repeatCount="indefinite"
          values="
            M 0 100 Q 50 120 100 100 T 200 100 T 300 100 T 400 100;
            M 0 100 Q 50 70 100 100 T 200 100 T 300 100 T 400 100;
            M 0 100 Q 50 80 100 100 T 200 100 T 300 100 T 400 100;
          "
        />
      </path>


      <path
        d="M 0 100 Q 50 120 100 100 T 200 100 T 300 100 T 400 100"
        stroke="#007bff55"
        strokeWidth="2"
        fill="transparent"
      >
        {/* Animation */}
        <animate
          attributeName="d"
          dur="3s"
          repeatCount="indefinite"
          values="
            M 0 100 Q 50 70 100 100 T 200 100 T 300 100 T 400 100;
            M 0 100 Q 50 20 100 100 T 200 100 T 300 100 T 400 100;
            M 0 100 Q 50 80 100 100 T 200 100 T 300 100 T 400 100;
          "
        />
      </path>
    </svg>
  );
}


const SpeechStaticSvg = () => {
  return (
    <svg
      width="400"
      height="200"
      viewBox="0 0 400 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wave */}
      <path
        d="M 0 100 Q 50 100 100 100 T 200 100 T 300 100 T 400 100"
        stroke="#007bff"
        strokeWidth="2"
        fill="transparent"
      >

      </path>

    </svg>
  );
}


const MicrophoneSvg = () => {
  return (
    <svg viewBox="-0.01 0 16.021 16.021" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(-348 -163.979)" fill="gray">
        <path d="M355.5 163.979c-1.412 0-2.5.844-2.5 2.542v5.934c0 1.699 1.088 2.545 2.5 2.545s2.5-.849 2.5-2.545v-5.933c0-1.696-1.088-2.543-2.5-2.543zm0 1c.506 0 .86.141 1.092.36.232.22.408.548.408 1.182v5.934c0 .634-.176.962-.408 1.182-.233.22-.586.363-1.092.363-.506 0-.86-.142-1.092-.361-.232-.22-.408-.548-.408-1.184v-5.933c0-.636.176-.963.408-1.182.232-.22.586-.361 1.092-.361z" color="#000000" overflow="visible"/>
        <rect height="4" width="1" x="355" y="175.5" color="#000000" overflow="visible"/>
        <path d="M355.5 179c-.833 0-1.668.159-2.5.458V180h5v-.542c-.833-.293-1.667-.458-2.5-.458z"/>
        <path d="M351 171v1.5a4.49 4.49 0 0 0 4.5 4.5 4.49 4.49 0 0 0 4.5-4.5V171h-1v1.5c0 1.939-1.561 3.5-3.5 3.5a3.492 3.492 0 0 1-3.5-3.5V171z"/>
    </g>
</svg>
  );
}


const DialogPage = () => {
  let { username } = useParams();

  let [isSpeaking, setIsSpeaking] = useState(false);
  let [messageText, setMessageText] = useState("");

  const [isListening, setIsListening] = useState(false);
  const recognition = new window.webkitSpeechRecognition();

  recognition.lang = 'en-US';
  // recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');
    setMessageText(transcript);
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const onSend = async () => {
    await setMessageText("");

    const response = await fetch("http://127.0.0.1:5000/message_stream", {
      method: "POST",
      body: JSON.stringify({
        "recipient": username,
        "message": messageText
      })});

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    audio.addEventListener('play', async () => {
      await setIsSpeaking(true);
    });

    // Event listener for when playback finishes
    audio.addEventListener('ended', async () => {
      await setIsSpeaking(false);
    });

    await audio.play();
  }

  let person = contacts[username];

  return (
    <div className={style.wrapper}>
      <div style={{width: "700px", marginTop: "40px"}}>
        <div><Link to={"/"} style={{color: "white"}}>Back</Link></div>

        <div style={{marginTop: "50px"}}>
          <div style={{textAlign: "center", fontWeight: "bold", fontSize: 46, color: "white"}}>{person.name}</div>
          <div style={{textAlign: "center", fontSize: 24, color: "white"}}>{person.description}</div>
        </div>

        <div style={{display: "flex", justifyContent: "center"}} >
          {isSpeaking ? <SpeachSvg /> : <SpeechStaticSvg />}
        </div>

        <div className={style.controlsWrapper}>
          <div className={style.messageInputWrapper}>
            <input className={style.messageInput} value={messageText} onChange={e => setMessageText(e.target.value)} />
            <div onClick={onSend} className={style.messageBtn}>Send</div>
          </div>

          <div className={style.microphoneWrapper} style={{backgroundColor: isListening ? "#00800090" : "#ffffff50"}} onClick={toggleListening}>
            <img style={{width: "15px"}} src="/microphone.png" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DialogPage;
