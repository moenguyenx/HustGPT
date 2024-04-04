'use client'
import classes from './page.module.css';
import '../global.css';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import useToken from '@/components/auth/useToken';
import useUser from '@/components/auth/useUser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Login() {  //React-toastify
    const router = useRouter();
    const { setToken } = useToken();
    const { setUsername } = useUser();

    const [loginForm, setloginForm] = useState({
          username: "",
          password: ""
        })
  
    function logMeIn(event) {
        axios({
          method: "POST",
          url: `${BACKEND_URL}/token`,
          data:{
            username: loginForm.username,
            password: loginForm.password
           }
        })
        .then((response) => {
          setToken(response.data.access_token);
          setUsername(response.data.username)
          toast.success(`Welcome ${response.data.username}`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            router.push("/");
          }, 3000);
          
        }).catch((error) => {
          console.log(error.response.data.msg);
          toast.error(error.response.data.msg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
  
        setloginForm(({
          username: "",
          password: ""}))
  
        event.preventDefault();
      }
  
    function handleChange(event) { 
        const {value, name} = event.target
        setloginForm(prevNote => ({
            ...prevNote, [name]: value})
        )}
  
    return (
      <>
      
    <div className={classes.container}>
      <ToastContainer />
      <h1 className={classes.formHeader}>Login Form</h1>
      <form className={classes.logInForm}>
        <label htmlFor='username' className={classes.formLabel}>Username:</label>
        <input className={classes.userInput} 
              type='text' 
              name='username' 
              placeholder='Enter your username'
              onChange={handleChange} 
              text={loginForm.username} 
              value={loginForm.username}
              required>
        </input>

        <label htmlFor='password' className={classes.formLabel}>Password:</label>
        <input className={classes.userInput} 
              type='password' 
              name='password' 
              placeholder='Enter your password' 
              onChange={handleChange} 
              text={loginForm.password} 
              value={loginForm.password}
              required>
        </input>

        <p className={classes.check}>Don't have account? <Link href="/register">Register</Link></p>
        
        <input className={classes.submitBtn} type='submit' value="Login" onClick={logMeIn}></input>
      </form>
    </div>
    </>
    );
}