'use client';
import { useState } from 'react';

export default function useToken() {
  function getToken() {
    if (typeof window !== 'undefined') {
      const userToken = localStorage.getItem('token');
      return userToken && userToken;
    }
    return null;
  }

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', userToken);
      setToken(userToken);
    }
  }
  
  function removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      setToken(null);
    }
  }

  return {
    setToken: saveToken,
    token,
    removeToken
  };
}
