import React, { useState, useEffect } from 'react';
import { ChatAiWidget } from '@sendbird/chat-ai-widget';
import '@sendbird/chat-ai-widget/dist/style.css';

const ChatbotWidget = () => {
    const APP_ID = import.meta.env.VITE_SENDBIRD_APP_ID;
    const BOT_ID = import.meta.env.VITE_SENDBIRD_BOT_ID;

    const [userId, setUserId] = useState(''); // User ID
    // const [sessionToken, setSessionToken] = useState(''); // JWT Token
    //
    // useEffect(() => {
    //     // Fetch the JWT token from your backend
    //     const fetchToken = async () => {
    //         const response = await fetch('/api/get-jwt', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ userId: 'USER_ID' }), // Replace with actual user ID
    //         });
    //         const data = await response.json();
    //         setSessionToken(data.token);
    //     };
    //
    //     fetchToken();
    // }, []);

    const sessionToken = localStorage.getItem('authToken');

    return (
        <ChatAiWidget
            applicationId={APP_ID} // Replace with your Sendbird Application ID
            botId={BOT_ID} // Replace with your Bot ID
            userId={userId}
            sessionToken={sessionToken}
        />
    );
};

export default ChatbotWidget;
