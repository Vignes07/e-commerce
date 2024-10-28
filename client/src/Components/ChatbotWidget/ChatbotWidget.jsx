
import React, { useState, useEffect } from 'react';
import { ChatAiWidget } from '@sendbird/chat-ai-widget';
import '@sendbird/chat-ai-widget/dist/style.css';

const ChatbotWidget = () => {
    const [appId, setAppId] = useState('');
    const [botId, setBotId] = useState('');
    const [userId, setUserId] = useState(''); // User ID
    const [loading, setLoading] = useState(true);

    // Retrieve session token and user ID from local storage
    const sessionToken = localStorage.getItem('authToken');
    const storedUserId = localStorage.getItem('userId');
    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchSendbirdCredentials = async () => {
            try {
                const response = await fetch(`${api}/api/sendbird-credentials`);
                const data = await response.json();
                setAppId(data.appId);
                setBotId(data.botId);
                setUserId(storedUserId); // Set the user ID from local storage
                setLoading(false); // Stop loading after data is fetched
            } catch (error) {
                console.error('Error fetching Sendbird credentials:', error);
                setLoading(false); // Stop loading if there's an error
            }
        };

        fetchSendbirdCredentials();
    }, [api, storedUserId]);

    const callSendbirdFunction = async (userId, sessionToken) => {
        console.log('Calling Sendbird function with:', { userId, sessionToken });
        try {
            const response = await fetch(`${api}/sendbird/getOrders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, sessionToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to call Sendbird function');
            }

            const result = await response.json();
            console.log('Sendbird function result:', result);
        } catch (error) {
            console.error('Error calling Sendbird function:', error);
        }
    };

    if (loading) {
        return <div>Loading Chat Widget...</div>;
    }

    return (
        appId && botId ? (
            <ChatAiWidget
                applicationId={appId}
                botId={botId}
                userId={userId}
                sessionToken={sessionToken}
                onMessageSend={async (message) => {
                    console.log('Message sent:', message);
                    // Check if the message should trigger the function call
                    if (message.includes('track my order')) {
                        console.log('Tracking order for user:', userId);
                        await callSendbirdFunction(userId, sessionToken);
                    }
                }}
            />
        ) : (
            <div>Error loading chat widget. Please try again later.</div>
        )
    );
};

export default ChatbotWidget;
