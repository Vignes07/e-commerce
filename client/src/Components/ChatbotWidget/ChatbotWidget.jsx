
import React, {useState, useEffect, useContext} from 'react';
import { ChatAiWidget } from '@sendbird/chat-ai-widget';
import '@sendbird/chat-ai-widget/dist/style.css';
import {AuthContext} from "../../Context/AuthContext.jsx";

const ChatbotWidget = () => {
    const [appId, setAppId] = useState('');
    const [botId, setBotId] = useState('');
    const {user} = useContext(AuthContext);
    const userId = user ? user._id : null;
    const [orderId, setOrderId] = useState(''); // Order ID
    const sessionToken = localStorage.getItem('authToken');
    const api = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState(null); // State to store order data

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

    const handleTrackOrder = async () => {
        console.log(userId, orderId)
        if (userId && orderId) {
            try {
                const response = await fetch(`${api}/sendbird/getOrders/${userId}/${orderId}`);
                const data = await response.json();
                console.log(data)
                setOrderData(data); // Store the order data
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        } else {
            alert('Please enter a valid order ID.');
        }
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
                    sessionToken={sessionToken}
                />
            ) : (
                <div>Error loading chat widget. Please try again later.</div>
            )}
            <div>
                <h2>Track Your Order</h2>
                <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter your order ID"
                />
                <button onClick={handleTrackOrder}>Track Order</button>
            </div>
            {orderData && (
                <div>
                    <h3>Order Details:</h3>
                    <pre>{JSON.stringify(orderData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;
