import React, {useContext, useEffect, useState, useRef} from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import {Link, useNavigate} from 'react-router-dom';
import {ShopContext} from '../../Context/ShopContext';
import {AuthContext} from '../../Context/AuthContext'; // Import AuthContext

export const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const {getTotalCartItems} = useContext(ShopContext);
    const {isAuthenticated, user, setIsAuthenticated, setUser} = useContext(AuthContext);
    const navigate = useNavigate()

    const dropdownRef = useRef(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Cleanup event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setUser]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        setDropdownOpen(false);
        navigate("/login")
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
    };

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt=""/>
                <p>BRAND</p>
            </div>
            <ul className='nav-menu'>
                <li onClick={() => setMenu("shop")}>
                    <Link style={{textDecoration: 'none'}} to='/'>Shop</Link>
                    {menu === "shop" && <hr/>}
                </li>
                <li onClick={() => setMenu("mens")}>
                    <Link style={{textDecoration: 'none'}} to='/mens'>Men</Link>
                    {menu === "mens" && <hr/>}
                </li>
                <li onClick={() => setMenu("womens")}>
                    <Link style={{textDecoration: 'none'}} to='/womens'>Women</Link>
                    {menu === "womens" && <hr/>}
                </li>
                <li onClick={() => setMenu("kids")}>
                    <Link style={{textDecoration: 'none'}} to='/kids'>Kid</Link>
                    {menu === "kids" && <hr/>}
                </li>
            </ul>
            <div className="nav-login-cart">
                {isAuthenticated ? (
                    <div className="nav-account" ref={dropdownRef}>
                        <span className="material-symbols-outlined" onClick={toggleDropdown}>
                            account_circle
                        </span>
                        {isDropdownOpen && (
                            <div className="dropdown-content">
                                <div className="username">{user.name || 'User'}</div>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="nav-account" ref={dropdownRef}>
                        <span className="material-symbols-outlined" onClick={toggleDropdown}>
                            account_circle
                        </span>
                        {isDropdownOpen && (
                            <div className="dropdown-content">
                                <Link to='/login'>
                                    <button>Login</button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                <Link to='/orders'>
                    <span className="material-symbols-outlined">orders</span>
                </Link>
                <Link to='/cart'>
                    <img src={cart_icon} alt="Cart"/>
                </Link>
                <div className="nav-cart-count">
                    {getTotalCartItems()}
                </div>
            </div>
        </div>
    );
};
