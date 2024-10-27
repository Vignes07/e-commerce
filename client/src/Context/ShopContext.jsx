import React, { createContext, useState, useEffect, useContext } from 'react';
import all_product from '../Components/Assets/all_product';
import { AuthContext } from "./AuthContext";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState([]); // Initialize as an array
    const { user } = useContext(AuthContext);
    const api = import.meta.env.VITE_API_URL

    useEffect(() => {
        const fetchCart = async () => {
            if (user && user._id) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`${api}/cart/${user._id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const fetchedCartItems = []; // Initialize as an array
                        data.items.forEach(item => {
                            fetchedCartItems.push({
                                productId: item.productId,
                                quantity: item.quantity
                            });
                        });
                        setCartItems(fetchedCartItems); // Set fetched items
                    } else {
                        console.error('Failed to fetch cart data');
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                }
            }
        };

        fetchCart();
    }, [user]);

    const addToCart = async (userId, productId, quantity) => {
        if (!user || !user._id) return;
        setCartItems((prevCartItems) => {
            const newCartItems = [...prevCartItems];
            const existingItem = newCartItems.find(item => item.productId === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                newCartItems.push({ productId, quantity });
            }

            return newCartItems; // Return updated cart
        });

        try {
            const token = localStorage.getItem('authToken');
            await fetch(`http://localhost:5000/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    items: [{ productId: Number(productId), quantity }],
                }),
            });
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeFromCart = async (userId, productId) => {
        setCartItems((prevCartItems) => {
            return prevCartItems.filter(item => item.productId !== productId);
        });

        try {
            const token = localStorage.getItem('authToken');
            await fetch(`http://localhost:5000/cart/${userId}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    items: [{ productId: Number(productId) }],
                }),
            });
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const addAllToCart = () => {
        setCartItems((prevCartItems) => {
            const newCartItems = [...prevCartItems]; // Ensure it's an array
            all_product.forEach((product) => {
                const existingItem = newCartItems.find(item => item.productId === product.id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    newCartItems.push({ productId: product.id, quantity: 1 });
                }
            });
            return newCartItems; // Return updated cart
        });
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        cartItems.forEach(item => {
            const productInfo = all_product.find(product => product.id === item.productId);
            if (productInfo) {
                totalAmount += productInfo.new_price * item.quantity;
            }
        });
        return totalAmount;
    };

    const getTotalCartItems = () => {
        return cartItems.length; // Return the count of cart items
    };

    const clearCart = () => {
        setCartItems([]); // Clear the cart items in the state
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        addAllToCart,
        clearCart
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
