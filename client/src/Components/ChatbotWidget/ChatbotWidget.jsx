import React, { useState, useEffect, useContext } from 'react';
import { ChatAiWidget } from '@sendbird/chat-ai-widget';
import '@sendbird/chat-ai-widget/dist/style.css';
import { AuthContext } from '../../Context/AuthContext.jsx';

const ChatbotWidget = () => {
    const [appId, setAppId] = useState('');
    const [botId, setBotId] = useState('');
    const { user } = useContext(AuthContext);
    const userId = user ? user._id : null;
    const api = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSendbirdCredentials = async () => {
            try {
                const response = await fetch(`${api}/api/sendbird-credentials`);
                const data = await response.json();
                setAppId(data.appId);
                setBotId(data.botId);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Sendbird credentials:', error);
                setLoading(false);
            }
        };
        fetchSendbirdCredentials();
    }, []);

    const configureSession = () => ({
        onSessionTokenRequired: (resolve, reject) => {
            fetch(`${api}/sendbird/issue-session-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })
                .then(response => response.json())
                .then(data => resolve(data.token))
                .catch(error => reject(error));
        },
        onSessionRefreshed: () => console.log("Session refreshed successfully."),
        onSessionError: (err) => console.error("Session error:", err),
        onSessionClosed: () => console.log("Session closed.")
    });

    if (loading) {
        return <div>Loading Chat Widget...</div>;
    }

    return (
        <div>
            {appId && botId ? (
                <ChatAiWidget
                    applicationId={appId}
                    botId={botId}
                    userId={userId}
                    configureSession={configureSession}
                />
            ) : (
                <div>Error loading chat widget. Please try again later.</div>
            )}
        </div>
    );
};

export default ChatbotWidget;
