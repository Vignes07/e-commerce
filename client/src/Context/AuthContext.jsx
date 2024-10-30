import React, { createContext, useState, useEffect } from 'react';
import { createSendbirdUser } from "../utils/sendbirdUtils.js";
import {useNavigate} from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const expiration = localStorage.getItem('tokenExpiration');
        if (token && expiration) {
            if (new Date(expiration) > new Date()) {
                setIsAuthenticated(true);
            } else {
                handleLogout();
                navigate('/login');
            }
        }
    }, []);

    const handleLogin = async (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/');

        try {
            await createSendbirdUser(userData.user._id, userData.user.name);
            console.log("Sendbird user created successfully.");
        } catch (error) {
            console.error("Error creating Sendbird user:", error);
        }
    };

    const handleLogout = () => {
        localStorage.clear()
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
