import React, { useContext, useState, useEffect } from 'react';
import './OrderItems.css';
import { AuthContext } from "../../Context/AuthContext";
import { ShopContext } from "../../Context/ShopContext";

export const OrderItems = () => {
    const [orders, setOrders] = useState([]);
    const { all_product } = useContext(ShopContext);
    const { user } = useContext(AuthContext);
    const userId = user ? user._id : null;
    const api = import.meta.env.VITE_API_URL

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${api}/orders/${userId}`, { // Change the URL to not include userId
                    method: "GET", // Change method to POST
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    return (
        <div className='cartitems'>
            <div className="orderitems-format-main">
                <p>Order Id</p>
                <p>Products</p>
                <p>Price</p>
                <p>Delivery Estimate</p>
                <p>Address</p>
            </div>
            <hr />
            {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => {
                    const product = all_product.find((p) => p.id === order.productId);
                    return (
                        <div key={order._id} className="cartitems-row">
                            <div className="orderitems-format orderitems-format-main">
                                <p>{order._id}</p>
                                <p className="product-info">
                                    {product ? (
                                        <>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className='carticon-product-icon'
                                            />
                                            {product.name}
                                        </>
                                    ) : (
                                        'Product Not Found'
                                    )}
                                </p>
                                <p>${(product.new_price).toFixed(2)}</p>
                                <p>{new Date(order.deliveryDate).toLocaleDateString()}</p>
                                <p>{order.shippingData.address || 'Shipping Address'}</p>
                            </div>
                            <hr />
                        </div>
                    );
                })
            ) : (
                <p>No Orders Found</p>
            )}
        </div>
    );
};
