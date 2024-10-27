import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Add user state

    // Load authentication status from localStorage or token
    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Assuming a token is stored after login
        const userData = localStorage.getItem('user');

        if (token) {
            setIsAuthenticated(true);
            if (userData) {
                setUser(JSON.parse(userData)); // Parse and set user data
            }
        }
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    // Provide the context to children components
    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
