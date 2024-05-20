'use client';
import classes from './page.module.css';
import './global.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import MainChat from '@/components/chat/Main';
import SideBar from '@/components/chat/SideBar';
import Modal from '@/components/chat/Modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chatboxes, setChatboxes] = useState([]);
  const [selectedChatbox, setSelectedChatbox] = useState(null);
  const [modalState, setModalState] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      axios({
        method: 'GET',
        url: `${BACKEND_URL}/chatboxes`,
        headers: {
          Authorization: `Bearer ${session.user.access_token}`,
        },
      })
        .then((response) => {
          setChatboxes(response.data);
        })
        .catch((error) => {
          console.log(error.response.data.msg);
        });
    }
  }, [status, session, createSuccess, router]);

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
    <>
      <div className={classes.App}>
        <ToastContainer />
        {modalState && <Modal toggleModal={handleModal} onChatboxCreate={handleChatboxCreate} />}
        <SideBar
          username={session?.user.username}
          chatboxes={chatboxes}
          onChatboxSelect={handleChatboxSelection}
          createNewChat={handleModal}
        />
        <MainChat selectedChatbox={selectedChatbox} />
      </div>
    </>
  );
}
