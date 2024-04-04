'use client'
import classes from "./page.module.css";
import './global.css'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import MainChat from "@/components/chat/Main";
import SideBar from "@/components/chat/SideBar";
import useToken from "@/components/auth/useToken";
import Modal from "@/components/chat/Modal";
import { ToastContainer } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const {token} = useToken();
  const router = useRouter();
  const username = localStorage.getItem('username');

  const [chatboxes, setChatboxes] = useState([]);
  const [selectedChatbox, setSelectedChatbox] = useState(null);
  const [modalState, setModalState] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      axios({
        method: "GET",
        url: `${BACKEND_URL}/chatboxes`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log(response.data);
        setChatboxes(response.data);
      }).catch((error) => {
        console.log(error.response.data.msg);
      })
    }
  }, [token, createSuccess]);

  function handleChatboxSelection(chatboxId) {
    setSelectedChatbox(chatboxId);
  }

  function handleModal() {
    setModalState(!modalState);
  }

  function handleChatboxCreate() {
    setCreateSuccess(!createSuccess); // Toggle createSuccess to trigger useEffect
  }

  return (
    <div className={classes.App}>
      <ToastContainer />
      {modalState && <Modal toggleModal={handleModal} onChatboxCreate={handleChatboxCreate}/>}
      <SideBar username={username} chatboxes={chatboxes} onChatboxSelect={handleChatboxSelection} createNewChat={handleModal}/>
      <MainChat selectedChatbox={selectedChatbox}/>
    </div>
  );
}
