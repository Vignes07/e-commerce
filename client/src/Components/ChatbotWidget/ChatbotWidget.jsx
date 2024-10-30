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
    const authToken = localStorage.getItem('authToken');
    const [loading, setLoading] = useState(true);

    // const [sessionToken, setSessionToken] = useState("")



    // useEffect(() => {
    //     setSessionToken(authToken)
    // }, [authToken]);

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

    // useEffect(() => {
    //     issueSessionToken(userId).then(token => setSessionToken(token));
    // }, [userId]);

    const configureSession = () => ({
        onSessionTokenRequired: (resolve, reject) => {
            issueSessionToken(userId)
                .then((token) => resolve(token))
                .catch((err) => reject(err));
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
    });

    if (loading) {
        return <div>Loading Chat Widget...</div>;
    }

    return (
        <div>
            {appId && botId && userId && authToken ? (
                <ChatAiWidget
                    applicationId={appId}
                    botId={botId}
                    userId={userId}
                    sessionToken={localStorage.getItem('authToken')}
                    configureSession={configureSession}
                />
            ) : (
                <div>Error loading chat widget. Please try again later.</div>
            )}
        </div>
    );
};

export default ChatbotWidget;
