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
    const [prompt, setPrompt] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

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

    useEffect(() => {
        if (!file) {
          return
        }
    
        const reader = new FileReader()
    
        reader.onloadend = () => {
          setPreviewUrl(reader.result)
        }
    
        reader.readAsDataURL(file)
      }, [file])

    function handlePromptChange(event) {
        const { name, value } = event.target;
        setPrompt(value);
    }

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    }

    async function handleSend() {
        try {
            var data = {
                message: null,
                img_url: null
            }

            //! Case 1: Prompt only
            if (prompt !== "") 
            {
                data.message = prompt; 

                //! Case 2: Prompt + Image data
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);
                    try {
                        const response = await fetch("api/s3-upload", {
                            method: "POST",
                            body: formData,
                        });
                        const { img_url } = await response.json()
                        data.img_url = img_url;
                    } catch ( error) {
                        console.error(error);
                    }
                }
                const userMessage = { ...data, from_bot: false };
                setMessages(prevMessages => [...prevMessages, userMessage]);
                
            } 
            //! Case 3: Image data only
            else if (prompt === "" && file !== null)
            {
                const formData = new FormData();
                formData.append("file", file);
                try {
                    const response = await fetch("api/s3-upload", {
                        method: "POST",
                        body: formData,
                    });
                    const { img_url } = await response.json()
                    data.img_url = img_url;
                } catch (error) {
                    console.error(error);
                }
            }
            // Request backend
            if (data.message !== null || data.img_url !== null) {
                const response = await axios({
                    method: "POST",
                    url: `${BACKEND_URL}/message/${selectedChatbox}`,
                    data: data,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const botMessage = {
                    message: response.data.msg, 
                    img_url: response.data.img_url, 
                    from_bot: true 
                };
                setMessages(prevMessages => [...prevMessages, botMessage]);

                setPrompt("");
                setFile(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.log(error);
        }
    
    }

    return (
        <div className={classes.main}>
            {selectedChatbox !== null && 
            <>
            <Messages>
                {messages.map((message, index) => (
                    <Message key={index} from_bot={message.from_bot} message={message.message} img_url={message.img_url}/>
                ))}
                <div ref={msgEnd}></div>
            </Messages>
            <div className={classes.chatFooter}>
                <div className={classes.inp}>
                <input type="text" name="message" 
                            placeholder="Send a Message"
                            value={prompt}
                            onChange={handlePromptChange}
                            /> 
                    <label htmlFor="file" className={classes.label}>
                        <Image src={attachImg} height={25} width={25}/>
                    </label>
                    <input type="file" 
                            id="file" 
                            accept="image/*" 
                            style={{visibility: "hidden"}}
                            onChange={handleFileChange}
                            />
                    {previewUrl && 
                    <div className={classes.inpImg}>
                        <Image width={100} height={100} src={previewUrl} alt="Preview" />
                    </div>
                    }
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