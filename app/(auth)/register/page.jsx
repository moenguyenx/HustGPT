'use client';
import classes from './page.module.css';
import '@/app/(application)/global.css';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Register() {
  const [registerForm, setRegisterForm] = useState(
    {
      username: "",
      email: "",
      password: ""
    }
  );

  function register(event) {
    axios(
      {
        method: "POST",
        url: `${BACKEND_URL}/register`,
        data: {
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password
        }
      }
    )
    .then((response) => {
      toast.success(response.data.msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      
    }).catch((error) => {
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

    setRegisterForm(({
      username: "",
      email: "",
      password: ""
    }))

    event.preventDefault();
  }

  function handleChange(event) {
    const {value, name} = event.target;
    setRegisterForm(prvForm => (
      {
        ...prvForm,
        [name]: value
      }
    ))
  }
    return (
    <div className={classes.container}>
      <ToastContainer />
      <h1 className={classes.formHeader}>Register Form</h1>
      <form className={classes.logInForm}>
        <label htmlFor='username' className={classes.formLabel}>Username:</label>
        <input className={classes.userInput} 
              type='text' 
              name='username' 
              placeholder='Enter your username' 
              onChange={handleChange}
              text={registerForm.username}
              value={registerForm.username}
              required>      
        </input>

        <label htmlFor='email' className={classes.formLabel}>Email:</label>
        <input className={classes.userInput} 
              type='text' 
              name='email'
              placeholder='Enter your email'
              onChange={handleChange}
              text={registerForm.email}
              value={registerForm.email} 
              required>
        </input>

        <label htmlFor='password' className={classes.formLabel}>Password:</label>
        <input className={classes.userInput} 
              type='password' 
              name='password' 
              placeholder='Enter your password'
              onChange={handleChange}
              text={registerForm.password}
              value={registerForm.password} 
              required>
        </input>

        <p className={classes.check}>Already have account? <Link href="/login">Log in</Link></p>
        
        <input className={classes.submitBtn} type='submit' value="Register" onClick={register}></input>
      </form>
    </div>
    );
}