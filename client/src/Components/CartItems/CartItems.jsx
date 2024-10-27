import React, {useContext, useState} from 'react';
import './CartItems.css';
import {ShopContext} from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import {AuthContext} from "../../Context/AuthContext";

export const CartItems = () => {
    const {getTotalCartAmount, all_product, cartItems, removeFromCart, clearCart} = useContext(ShopContext);
    const {user} = useContext(AuthContext);
    const userId = user ? user._id : null;
    const api = import.meta.env.VITE_API_URL

    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        // paymentInfo: ''
    });

    const handleRemove = async (userId, productId) => {
        await removeFromCart(userId, productId);
    };

    const handlePlaceOrder = async (e, userId, cartItems, shippingData, totalPrice) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${api}/orders/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
                    orderedProducts: cartItems,
                    shippingData,
                    totalPrice,
                })
            })
            console.log(response)
            if (response.ok) {
                const data = await response.json();
                clearCart();
            } else {
                const errorData = await response.json();
                console.error('Failed to place order:', response.statusText, errorData);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Titles</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr/>

            {Array.isArray(cartItems) && cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                Array.isArray(cartItems) && cartItems.map((item) => {
                    const {productId, quantity} = item;
                    const product = all_product.find((e) => e.id === productId);

                    if (product) {
                        return (
                            <div key={product.id}>
                                <div className="cartitems-format cartitems-format-main">
                                    <img src={product.image} alt={product.name} className='carticon-product-icon'/>
                                    <p>{product.name}</p>
                                    <p>${product.new_price.toFixed(2)}</p>
                                    <button className='cartitems-quantity'>{quantity}</button>
                                    <p>${(product.new_price * quantity).toFixed(2)}</p>
                                    <img
                                        className='cartitems-remove-icon'
                                        src={remove_icon}
                                        onClick={() => handleRemove(userId, product.id)}
                                        alt="Remove from cart"
                                    />
                                </div>
                                <hr/>
                            </div>
                        );
                    }
                    return null;
                })
            )}

            {/* Cart Summary */}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Total</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <p>Total</p>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    {!showCheckoutForm ? (
                        <button onClick={() => setShowCheckoutForm(true)}>PROCEED TO CHECKOUT</button>
                    ) : (
                        ""
                    )}

                    {showCheckoutForm && (
                        <div className="checkout">
                            <h2>Checkout Information</h2>
                            <br/>
                            <form className={"checkout-form"}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder={"Name"}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder={"Phone No"}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                <textarea
                                    name="address"
                                    placeholder={"Address"}
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                                {/*<input*/}
                                {/*    type="text"*/}
                                {/*    name="paymentInfo"*/}
                                {/*    value={formData.paymentInfo}*/}
                                {/*    onChange={handleInputChange}*/}
                                {/*/>*/}
                                <button type="submit"
                                        onClick={(e) => handlePlaceOrder(e, userId, cartItems, formData, getTotalCartAmount())}>Confirm
                                    Order
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="cartitems-promocode">
                    <p>If you have a promo code, enter it here</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder='promo code'/>
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
