import React, { useState, useEffect, useContext } from 'react';
import { ChatAiWidget } from '@sendbird/chat-ai-widget';
import '@sendbird/chat-ai-widget/dist/style.css';
import { AuthContext } from '../../Context/AuthContext.jsx';
import { fetchSendbirdCredentials, issueSessionToken } from '../../utils/sendbirdUtils.js';

const ChatbotWidget = () => {
    const [appId, setAppId] = useState('');
    const [botId, setBotId] = useState('');
    const { user } = useContext(AuthContext);
    const userId = user ? user._id : null;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCredentials = async () => {
            try {
                const data = await fetchSendbirdCredentials();
                setAppId(data.appId);
                setBotId(data.botId);
            } catch (error) {
                console.error('Error fetching Sendbird credentials:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCredentials();
    }, []);

    const configureSession = () => {
        console.log("Configuring session...", userId); // Log for debugging
        return {
            onSessionTokenRequired: async (resolve, reject) => {
                console.log("Session token required..."); // Log when token is needed
                try {
                    console.log("Current userId:", userId); // Log userId
                    const token = await issueSessionToken(userId);
                    resolve(token);
                } catch (error) {
                    console.error('Error issuing session token:', error);
                    reject(error);
                }
            },
            onSessionRefreshed: () => {
                console.log("Session refreshed successfully.");
            },
            onSessionError: (err) => {
                console.error("Session error:", err);
            },
            onSessionClosed: () => {
                console.log("Session closed.");
            },
        };
    };

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
