import './App.css';
import { Navbar } from './Components/Navbar/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import ChatbotWidget from "./Components/ChatbotWidget/ChatbotWidget.jsx";

function App() {
    const location = useLocation();

    const noNavbarRoutes = ['/login', '/signup'];

    return (
        <div>
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
            {!noNavbarRoutes.includes(location.pathname) && <Footer/>}
        </div>
    );
}

export default App;
