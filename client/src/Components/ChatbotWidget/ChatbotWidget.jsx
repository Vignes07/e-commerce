import React, { useState, useEffect } from 'react';
import { ChatAiWidget } from '@sendbird/chat-ai-widget';
import '@sendbird/chat-ai-widget/dist/style.css';

const ChatbotWidget = () => {
    const [appId, setAppId] = useState('');
    const [botId, setBotId] = useState('');
    const [userId, setUserId] = useState(''); // User ID
    const sessionToken = localStorage.getItem('authToken');
    const api = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSendbirdCredentials = async () => {
            try {
                const response = await fetch(`${api}/api/sendbird-credentials`);
                const data = await response.json();
                setAppId(data.appId);
                setBotId(data.botId);
                setLoading(false); // Stop loading after data is fetched
            } catch (error) {
                console.error('Error fetching Sendbird credentials:', error);
                setLoading(false); // Stop loading if there's an error
            }
        };

        fetchSendbirdCredentials();
    }, []);

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
                onFunctionCall={handleFunctionCall}
            />
        ) : (
            <div>Error loading chat widget. Please try again later.</div>
        )
    );
};

const handleFunctionCall = async (functionName, parameters) => {
    const api = import.meta.env.VITE_API_URL;
    const sessionToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    console.log("Function called:", functionName);
    console.log("Parameters:", parameters);
    if (functionName === 'trackOrders') {
        try {
            const response = await fetch(`${api}/sendbird/getOrders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify({ userId, sessionToken })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error tracking orders:', error);
            return { error: 'Failed to track orders' };
        }
    }
    // Handle other function calls if needed
};

export default ChatbotWidget;
