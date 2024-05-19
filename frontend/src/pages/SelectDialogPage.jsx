import React, {useState} from 'react';
import style from "./SelectDialogPage.module.css"
import { Link } from 'react-router-dom';
import {backendServer, contacts} from "../constants";


const UserProfileCard = ({username, name, description}) => {
  return (
    <div className={style.userContactWrapper}>
      <div style={{width: "100px", marginRight: "15px", borderRight: "1px solid #000"}}><b>{name}</b></div>
      <div style={{width: "100%", marginRight: "15px", borderRight: "1px solid #000"}}>{description}</div>
      <div><Link to={"/contact/" + username}>Call</Link></div>
    </div>
  );
}

const SelectDialogPage = () => {

  let [newContact, setNewContact] = useState({
    "name": "",
    "mood": "neutral",
    "style": "friendly"
  });

  const voices = ["fable", "shimmer", "onyx", "nova"];

  const onCreateNewContact = async () => {
    if (!newContact['name']) {
      return
    }

    const prompt = `You are a ${newContact['mood']} person with ${newContact['style']} style of speech. Your name is ${newContact['name']}`;

    const voiceIndex = Math.floor(Math.random() * voices.length);

    const response = await fetch(`${backendServer}/contacts`, {
      method: "POST",
      body: JSON.stringify({
        "name": newContact['name'],
        "role": prompt,
        "voice": voices[voiceIndex]
      })
    });

    contacts[newContact['name']] = {
      "name": newContact['name'],
      "description": `${newContact['name']}: ${newContact['mood']} person, who speaks ${newContact['style']}`
    }

    setNewContact({
      "name": "",
      "mood": "neutral",
      "style": "friendly"
    });
  }

  return (
    <div className={style.wrapper}>

      <div style={{width: "700px"}}>

        <div style={{fontSize: 48, fontWeight: "bold", color: "white", marginBottom: "30px"}}>
          Contacts
        </div>

        { Object.entries(contacts).map(([key, val]) =>
          <UserProfileCard key={key} username={key} name={val.name} description={val.description}/>
        )}

        <br/><br/><br/><br/>
        <div style={{
          display: "flex", justifyContent: "center", padding: " 30px 15px",
          borderRadius: "15px",
          flexWrap: "wrap", boxShadow: "1px 1px 1px #000",
          backgroundColor: "#ffffff22"}}>

          <div style={{marginBottom: "15px", width: "400px"}}>
            <div style={{color: "white"}}>Name</div>
            <input value={newContact['name']} className={style.newContactName}
                   onChange={e => setNewContact({
                     ...newContact,
                     name: e.target.value
                   })} />
          </div>

          <div style={{marginBottom: "15px", width: "400px"}}>
            <div style={{color: "white"}}>Mood</div>
            <select value={newContact['mood']} className={style.characterFeatureSelect}
                    onChange={e => setNewContact({
                     ...newContact,
                     mood: e.target.value
                   })}>
              <option value="sad">Sad</option>
              <option value="happy">Happy</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          <div style={{marginBottom: "15px", width: "400px"}}>
            <div style={{color: "white"}}>Style</div>
            <select value={newContact['style']} className={style.characterFeatureSelect}
                    onChange={e => setNewContact({
                     ...newContact,
                     style: e.target.value
                   })}>
              <option value="formal">Formal</option>
              <option value="sarcastic">Sarcastic</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>

          <div className={style.addContactBtn} onClick={onCreateNewContact}>
            Add new
          </div>


        </div>

      </div>

    </div>
  );
};

export default SelectDialogPage;
