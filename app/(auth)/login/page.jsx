'use client'
import classes from './page.module.css';
import '@/app/(application)/global.css';
import Link from 'next/link';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signIn } from 'next-auth/react';

export default function Login() {

    const [loginForm, setLoginForm] = useState({
        username: "",
        password: ""
    });

    async function logMeIn(event) {
        event.preventDefault();

        const signInResult = await signIn('credentials', {
            redirect: false,
            username: loginForm.username,
            password: loginForm.password,
            callbackUrl: '/'
        });

        if (!signInResult.ok) {
            toast.error("Failed to login. Please check your username and password.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.success("Successfully logged in", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            window.location.href = signInResult.url || '/';
        }

        setLoginForm({
            username: "",
            password: ""
        });
    }

    function handleChange(event) {
        const { value, name } = event.target;
        setLoginForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    }

    return (
        <>
            <div className={classes.container}>
                <ToastContainer />
                <h1 className={classes.formHeader}>Login Form</h1>
                <form className={classes.logInForm} onSubmit={logMeIn}>
                    <label htmlFor='username' className={classes.formLabel}>Username:</label>
                    <input className={classes.userInput}
                        type='text'
                        name='username'
                        placeholder='Enter your username'
                        onChange={handleChange}
                        value={loginForm.username}
                        required>
                    </input>

                    <label htmlFor='password' className={classes.formLabel}>Password:</label>
                    <input className={classes.userInput}
                        type='password'
                        name='password'
                        placeholder='Enter your password'
                        onChange={handleChange}
                        value={loginForm.password}
                        required>
                    </input>

                    <p className={classes.check}>Don&apos;t have account? <Link href="/register">Register</Link></p>

                    <button className={classes.submitBtn} type='submit'>Login</button>
                </form>
            </div>
        </>
    );
}
