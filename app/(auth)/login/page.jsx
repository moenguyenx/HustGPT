'use client'
import classes from './page.module.css';
import '../global.css';
import Link from 'next/link';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Login() {  //React-toastify

    const [loginForm, setloginForm] = useState({
          username: "",
          password: ""
        })
  
    async function logMeIn(event) {
        const signInResult = await signIn(
          'credentials',
          {
            username: loginForm.username,
            password: loginForm.password,
            callbackUrl: '/'
          }
        )
        if (!signInResult.ok) {
          toast.error("Failed to login", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
        }
  
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