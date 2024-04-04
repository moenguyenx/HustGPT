'use client';
import { useState } from 'react';

export default function useUser() {
  function getUser() {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      return username && username;
    }
    return null;
  }

  const [username, setUsername] = useState(getUser());

  function saveUsername(username) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('username', username);
      setUsername(username);
    }
  }
  
  function removeUsername() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('username');
      setUsername(null);
    }
  }

  return {
    setUsername: saveUsername,
    username,
    removeUsername
  };
}
