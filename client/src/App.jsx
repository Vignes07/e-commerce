import './App.css';
import { Navbar } from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ShopCategory } from './Pages/ShopCategory';
import { Product } from './Pages/Product';
import { Shop } from './Pages/Shop';
import { Cart } from './Pages/Cart';
import { Orders } from './Pages/Orders';
import { Signup } from './Pages/Signup';
import { Login } from './Pages/Login';
import { Footer } from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kids_banner from './Components/Assets/banner_kids.png';
import {useState} from "react";
import Chatbot from "./Components/Chatbot/Chatbot.jsx";
import ChatbotWidget from "./Components/ChatbotWidget/ChatbotWidget.jsx";

function App() {
    const location = useLocation();

    const noNavbarRoutes = ['/login', '/signup'];

    const [isChatVisible, setIsChatVisible] = useState(false);

    const toggleChat = () => {
        setIsChatVisible(!isChatVisible);
    };

    return (
        <div>
            {/* Conditionally render Navbar */}
            {!noNavbarRoutes.includes(location.pathname) && <Navbar/>}
            <Routes>
                <Route path="/" element={<Shop/>}/>
                <Route path="/mens" element={<ShopCategory banner={men_banner} category="men"/>}/>
                <Route path="/womens" element={<ShopCategory banner={women_banner} category="women"/>}/>
                <Route path="/kids" element={<ShopCategory banner={kids_banner} category="kid"/>}/>
                <Route path='/Product' element={<Product/>}>
                    <Route path=':productId' element={<Product/>}/>
                </Route>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/orders' element={<Orders/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/login' element={<Login/>}/>
            </Routes>
            <ChatbotWidget />
            {/*<button className="chatbot-toggle" onClick={toggleChat}>*/}
            {/*    {isChatVisible ? <div className="chatbot-container">*/}
            {/*        <iframe*/}
            {/*            src="https://aichatbot.sendbird.com/playground/index.html?app_id=EE6FCBB4-F083-485D-9FA4-478D7CFC41F6&bot_id=onboarding_bot&region=ap-8"*/}
            {/*            width="350" // Set width to desired size*/}
            {/*            height="450" // Set height to desired size*/}
            {/*            frameBorder="0"*/}
            {/*        ></iframe>*/}
            {/*        <div className={"chat-bot"}>*/}
            {/*            <span id={"arrow"} className="material-symbols-outlined">keyboard_arrow_down</span>*/}
            {/*        </div>*/}
            {/*    </div> : (*/}
            {/*        <div className={"chat-bot"}>*/}
            {/*            <span id={"bot"} className="material-symbols-outlined">smart_toy</span>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</button>*/}
            {!noNavbarRoutes.includes(location.pathname) && <Footer/>}
        </div>
    );
}

export default App;
