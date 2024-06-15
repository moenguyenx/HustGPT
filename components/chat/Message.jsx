import Image from "next/image";
import userImg from "../../assets/user-icon.png";
import gptImgLogo from "../../assets/chatgptLogo.svg";
import classes from './Message.module.css';
import Markdown from "react-markdown";

export default function Message({ from_bot, message, img_url }) {
    return (
        <div className={from_bot ? classes.chatbot : classes.chat}>
            <div className={classes.wrapper}>
                <Image src={from_bot ? gptImgLogo : userImg} alt="" className={classes.chatImg} width={56} height={56} />
                {message && <p className={classes.txt}>
                                <Markdown>{message}</Markdown>
                            </p>
                }
            </div>
            
            <div className={classes.imgPrompt}>
                {img_url && <Image src={img_url} alt="Image Prompt" width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: '100%', height: 'auto' }}/>}
            </div>
        </div>
    );
}