import React from 'react';
import style from "./SelectDialogPage.module.css"
import { Link } from 'react-router-dom';
import {contacts} from "../constants";


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
  return (
    <div className={style.wrapper}>

      <div style={{width: "700px"}}>

        <div style={{fontSize: 48, fontWeight: "bold", color: "white", marginBottom: "30px"}}>
          Contacts
        </div>

        { Object.entries(contacts).map(([key, val]) =>
          <UserProfileCard key={key} username={key} name={val.name} description={val.description}/>
        )}

      </div>

    </div>
  );
};

export default SelectDialogPage;
