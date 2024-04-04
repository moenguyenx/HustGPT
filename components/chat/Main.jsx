'use client';
import sendBtn from "@/assets/send.svg";
import attachImg from "@/assets/attach.png"
import classes from "./Main.module.css"
import Image from "next/image";
import Message from "./Message";
import Messages from "./Messages";
import useToken from "@/components/auth/useToken";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function MainChat ({ selectedChatbox }) {
    const { token } = useToken();

    const msgEnd = useRef(null);
    const [messages, setMessages] = useState([]);
    const [promt, setPromt] = useState("");

    useEffect(() => {
        if (selectedChatbox !== null) {
            axios.get(`${BACKEND_URL}/messages/${selectedChatbox}`)
                 .then(response => {
                     setMessages(response.data);
                 })
                 .catch(error => {
                     console.error(error);
                 });
        }
    }, [selectedChatbox]);

    useEffect(() => {
        if (msgEnd.current) {
            msgEnd.current.scrollIntoView();
        }
    }, [messages]);

    function handlePromtChange(event) {
        const { name, value } = event.target;
        setPromt(value);
    }

    async function handleSend() {
        if (promt !== null && promt.trim() !== "") {
            setMessages([
                ...messages,
                {message: promt, from_bot: false}
            ])

            try {
                const response = await axios({
                    method: "POST",
                    url: `${BACKEND_URL}/message/${selectedChatbox}`,
                    data: {message: promt},
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(response.data);
                setMessages([
                    ...messages,
                    {message: response.data.msg, from_bot: true}
                ])
            } catch (error) {
                console.log(error);
            }
        }
        setPromt("");
    }

    return (
        <div className={classes.main}>
            {selectedChatbox !== null && 
            <>
            <Messages>
                {messages.map((message, index) => (
                    <Message key={index} from_bot={message.from_bot} message={message.message} />
                ))}
                <div ref={msgEnd}></div>
            </Messages>
            <div className={classes.chatFooter}>
                <div className={classes.inp}>
                    <input type="text" name="message" 
                            placeholder="Send a Message"
                            value={promt}
                            onChange={handlePromtChange}
                            /> 
                    <button className={classes.send} onClick={handleSend}>
                        <Image src={sendBtn} alt="Send" />
                    </button>
                </div>
                <p>HustGPT may produce inaccurate infomation, places, or facts.</p>
            </div>
            </>}
        </div>
    );
}

export default MainChat;

{/* <label htmlFor="file" className={classes.label}>
                        <Image src={attachImg} height={20} width={20}/>
                    </label>
                    <input type="file" id="file" style={{visibility: "hidden"}}/> */}