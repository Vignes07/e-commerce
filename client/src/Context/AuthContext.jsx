// /client/src/Context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { createSendbirdUser } from "../utils/sendbirdUtils.js"; // Import function to create Sendbird user

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }
    }, []);

    const login = async (userData) => {
        // Save user data and authentication status
        setIsAuthenticated(true);
        setUser(userData);

        // Save user data to localStorage
        localStorage.setItem('authToken', userData.token); // Assuming `userData` includes the token
        localStorage.setItem('user', JSON.stringify(userData));

        console.log("hgvg")

        // Create a new Sendbird user whenever a user logs in
        try {
            await createSendbirdUser(userData._id, userData.name); // Pass user ID and name
            console.log("Sendbird user created successfully.");
        } catch (error) {
            console.error("Error creating Sendbird user:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
