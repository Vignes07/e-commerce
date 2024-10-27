import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Loginsignup.css';
import { AuthContext } from '../Context/AuthContext';

export const Login = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const api = import.meta.env.VITE_API_URL

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            // console.log("Attempting to login...");

            const response = await fetch(`${api}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // console.log("Response from server:", data);

            if (response.ok && data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setIsAuthenticated(true);
                setUser(data.user); // Update user state
                navigate('/'); // Redirect to home page
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
