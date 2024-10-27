import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ShopContextProvider from './Context/ShopContext';
import {AuthProvider} from './Context/AuthContext';
import {BrowserRouter} from "react-router-dom"; // Adjust the path as necessary

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider> {/* Wrap with AuthProvider */}
        <ShopContextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </ShopContextProvider>
    </AuthProvider>
);
