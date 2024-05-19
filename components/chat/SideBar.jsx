import hustLogo from "../../assets/hustLogo.svg";
import addBtn from "../../assets/add-30.png"
import msgIcon from "../../assets/message.svg"
import userIcon from "../../assets/user.svg"
import logOutIcon from "../../assets/logOut.svg"
import classes from "./SideBar.module.css"
import Image from "next/image";
import { signOut } from "next-auth/react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SideBar({ username, chatboxes, onChatboxSelect, createNewChat }) {
  
  async function handleLogOut() {
    await axios.post(`${BACKEND_URL}/logout`);
    await signOut({callbackUrl: '/login'})
  }

  function handleChatboxClick(chatboxId) {
    if (onChatboxSelect) {
      onChatboxSelect(chatboxId); // Call the onChatboxSelect prop with the selected chatboxId
    }
  }

    return (
        <>
        <div className={classes.sideBar}>
            <div className={classes.upperSide}>
              <div className={classes.upperSideTop}><Image src={hustLogo} alt="" className={classes.logo} /><span className={classes.brand}>HustGPT</span></div>
                <button className={classes.midBtn} onClick={createNewChat}><Image src={addBtn} alt="" width={40} height={40} className={classes.addBtn}/>New Chat</button>
                
              <div className={classes.upperSideBottom}>
                {chatboxes.map((chatbox) => (
                   <button key={chatbox.id} className={classes.query} onClick={() => handleChatboxClick(chatbox.id)}>
                      <Image src={msgIcon} width={17.5} height={17.5} alt="Query" />
                      {chatbox.topic}
                    </button>
                ))}
                
              </div>
            </div>

            <div className={classes.lowerSide}>
              <button className={classes.user}>
                <Image src={userIcon} alt="User" className={classes.userImg} />
                {username}
              </button>
              <button className={classes.user} onClick={handleLogOut}><Image src={logOutIcon} alt="User" className={classes.userImg}/>Log Out</button>
            </div>
        </div>
        </>
    );
}


