"use client";
import classes from "./Modal.module.css";
import { useState } from "react";
import axios from "axios";
import useToken from "@/components/auth/useToken";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Modal({ toggleModal, onChatboxCreate }) {
  const [chatTopic, setChatTopic] = useState("");
  const { token } = useToken();

  function handleChange(event) {
    const { value } = event.target;
    setChatTopic(value);
  }

  async function handleCreate() {
    // Add logic to handle creation here
    console.log(chatTopic)
      await axios({
      method: "POST",
      url: `${BACKEND_URL}/create_chatbox`,
      data: {topic: chatTopic},
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then( (response) => {
      console.log(response.data.msg);
      toast.success(response.data.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      onChatboxCreate();
    }).catch( (err) => {
      console.log(err);
    })
    // Clear input field after creating
    setChatTopic("");
    // Close the modal
    toggleModal();
  }

  return (
    <>
      <div className={classes.modal}>
        <div onClick={toggleModal} className={classes.overlay}></div>
        <div className={classes["modal-content"]}>
          <button className={classes["close-modal"]} onClick={toggleModal}>
            &#x2715;
          </button>
          <h2 className={classes.title}>Create New Chat </h2>
          <div className={classes.inp}>
            <input
              type="text"
              placeholder="Enter new chat topic"
              value={chatTopic}
              onChange={handleChange}
            />
          </div>
          <button className={classes["create-btn"]} onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </>
  );
}
