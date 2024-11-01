import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ShopContextProvider from './Context/ShopContext';
import { AuthProvider } from './Context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter> {/* Wrap everything with BrowserRouter */}
        <AuthProvider>
            <ShopContextProvider>
                <App />
            </ShopContextProvider>
        </AuthProvider>
    </BrowserRouter>
);
