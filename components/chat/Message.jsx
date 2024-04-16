import Image from "next/image";
import userImg from "../../assets/user-icon.png";
import gptImgLogo from "../../assets/chatgptLogo.svg";
import classes from './Message.module.css';

export default function Message({ from_bot, message, img_url }) {
    return (
        <div className={from_bot ? classes.chatbot : classes.chat}>
            <Image src={from_bot ? gptImgLogo : userImg} alt="" className={classes.chatImg} width={56} height={56} />
            {message && <p className={classes.txt}>{message}</p>}
            {img_url && <Image className={classes.imgPrompt} src={img_url} alt="Image Prompt"/>}
        </div>
    );
}