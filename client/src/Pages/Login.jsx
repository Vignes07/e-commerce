import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Loginsignup.css';
import { AuthContext } from '../Context/AuthContext';
import {createSendbirdUser} from "../utils/sendbirdUtils.js";

export const Login = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser, login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const api = import.meta.env.VITE_API_URL

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${api}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            const expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getMonth() + 1);
            localStorage.setItem('tokenExpiration', expirationDate.toISOString());

            if (response.ok && data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                try {
                    await createSendbirdUser(data.user._id, data.user.name);
                    // console.log("Sendbird user created successfully.");
                } catch (error) {
                    console.error("Error creating Sendbird user:", error);
                }

                setIsAuthenticated(true);
                setUser(data.user);
                navigate('/');
            } else {
                console.error("Error from server:", data.message);
                setErrorMessage(data.message || 'Login failed');
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert('An error occurred during login');
        }
    };

    return (
        <div className='loginsignup'>
            <div className="login-container">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="loginsignup-fields">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="loginsignup-btn">Login</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <p className='loginsignup-login'>
                        Don't have an account? <span onClick={() => navigate('/signup')}>Sign up</span>
                    </p>
                </form>
            </div>
        </div>
    );
};
