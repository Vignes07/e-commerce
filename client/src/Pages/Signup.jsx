import React, {useState} from 'react'
import './CSS/Loginsignup.css'
import axios from 'axios'
import {useNavigate} from "react-router-dom";

export const Signup = () => {

    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:5000/signup", { name, email, password })
            .then(result => {console.log(result)
                navigate("/login")
            })
            .catch(err => console.log(err))
    }

    return (
        <div className='loginsignup'>
            <div className="signup-container">
                <h1>Sign up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="loginsignup-fields">
                        <input type="text" placeholder="Your Name" onChange={(e) => setName(e.target.value)}/>
                        <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type={"submit"} className="loginsignup-btn">Continue</button>
                    <p className='loginsignup-login'>Already have an account? <span
                        onClick={() => navigate('/login')}>Login</span></p>
                    <div className="loginsignup-agree">
                        <input type="checkbox" name='' id=''/>
                        <p>By continuing, i agree to the terms of use & privacy policy</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
