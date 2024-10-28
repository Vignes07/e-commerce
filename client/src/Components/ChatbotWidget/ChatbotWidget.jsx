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
            />
        ) : (
            <div>Error loading chat widget. Please try again later.</div>
        )
    );
};

export default ChatbotWidget;
