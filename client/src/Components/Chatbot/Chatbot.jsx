
import React, { useEffect, useState } from 'react';
import SendBird from 'sendbird';

const Chatbot = () => {
    const [sendbirdInstance, setSendbirdInstance] = useState(null);
    const [channel, setChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Initialize Sendbird
        const sb = new SendBird({ appId: import.meta.env.VITE_SENDBIRD_APP_ID });
        setSendbirdInstance(sb);

        // Connect to Sendbird
        sb.connect('USER_ID', 'JWT_TOKEN', (user, error) => {
            if (error) {
                console.error('Connection failed:', error);
                return;
            }

            // Create or get a group channel with the AI chatbot
            sb.GroupChannel.createChannelWithUserIds(['USER_ID', 'BOT_ID'], true, (channel, error) => {
                if (error) {
                    console.error('Channel creation failed:', error);
                    return;
                }
                setChannel(channel);

                // Load previous messages
                const messageListQuery = channel.createPreviousMessageListQuery();
                messageListQuery.load(20, true, (messageList, error) => {
                    if (error) {
                        console.error('Message loading failed:', error);
                        return;
                    }
                    setMessages(messageList);
                });
            });
        });
    }, []);

    const handleSendMessage = () => {
        if (channel && input.trim()) {
            channel.sendUserMessage(input, (message, error) => {
                if (error) {
                    console.error('Message sending failed:', error);
                    return;
                }
                setMessages([...messages, message]);
                setInput('');
            });
        }
    };

    return (
        <div>
            <div className="chat-window">
                {messages.map((message) => (
                    <div key={message.messageId} className="message">
                        <strong>{message.sender.nickname}:</strong> {message.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chatbot;
