import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

function useInput({ type, placeholder }) {
    const [value, setValue] = useState("");
    const input = <input className="input" value={value} onChange={e => setValue(e.target.value)} type={type} placeholder={placeholder} />;
    return [value, input];
}

export default function Login(props) {
    const [username, usernameInput] = useInput({type:"text", placeholder:"Username"});
    const [email, emailInput] = useInput({type:"text", placeholder:"Email"});
    const [password, passwordInput] = useInput({type:"password", placeholder:"Password"});
    const [notif, setNotif] = useState("");
    const [success, setSuccess] = useState("");

    const displayNotif = (msg, suc = "success") => {
        setNotif(msg);
        setSuccess(suc);
        setTimeout(() => {
            setNotif("")
        }, 4000);
    }

    const login = () => {
        axios.post(`${window.env.SERVER_URL}/api/auth/login`, {
            name: username,
            email,
            password
        }).then(res => {
            localStorage.setItem('jwt', res.data.token);
            localStorage.setItem('localPassword', res.data.localPassword)
            props.socket.emit("send_id", res.data._id);
            displayNotif("Success");
            props.setIsLogged(true);
        }).catch(err => {
            displayNotif(err.response.data, "error");
        });
    }

    const register = () => {
        axios.post(`${window.env.SERVER_URL}/api/auth/register`, {
            name: username,
            email,
            password
        }).then(res => {
            localStorage.setItem('jwt', res.data.token);
            localStorage.setItem('localPassword', res.data.localPassword)
            props.socket.emit("send_id", res.data._id);
            displayNotif("Success");
            props.setIsLogged(true);
        }).catch(err => {
            displayNotif(err.response.data, "error");
        });
    }

    return (
        <div className="main">
            <p className="sign" align="center">LOGIN</p>
            <div className="form">
                {usernameInput}
                {emailInput}
                {passwordInput}
            </div>
            <button className="submit" onClick={login}>Sign in</button>
            <button className="submit" onClick={register}>Sign up</button>
            {/* <p className="forgot" align="center"><a href="#" />Forgot Password?</p> */}
            {
                notif ? <div id="notificationBarBottom" className={success}>{notif}</div> : <></>
            }
            
        </div>
    );
}