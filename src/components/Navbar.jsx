import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, logout } from './utils/authSlice';
import usePreviousPath from './hooks/usePreviousPath';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('');
    const cartItems = useSelector((store)=>store.cart.items);
    const authData = useSelector((store)=>store.auth.authData);
    const dispatch = useDispatch();

    const prev_path = usePreviousPath();
    console.log(prev_path)

    useEffect( ()=>{
        if (authData && authData.user && authData.user.id) {
            setIsLogin(true);
            setUsername(authData.user.username);
        }
    },[authData])

    const totalCartItem = cartItems.length;
    
    const handleLogout = ()=>{
        dispatch(logout())
        setIsLogin(false);
        setUsername('');
        navigate('/login');
    }
    
    return (
        <header className="text-black bg-white body-font fixed w-full z-[2] shadow-lg">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-xl font-bold">MyShop</span>
                </Link>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <Link className="mr-5 hover:text-gray-900" to="/">Home</Link>
                    <Link className="mr-5 hover:text-gray-900" to="/about">About Us</Link>
                    <Link className="mr-5 hover:text-gray-900" to="/blog">Blog</Link>
                    <Link className="mr-5 hover:text-gray-900" to="/contact-us">Contact Us</Link>
                    <Link className="mr-1 hover:text-gray-900 flex" to="/cart"><img src="http://localhost:1337/uploads/cart_88c34f3e77.png"/>({totalCartItem})</Link>
                </nav>
                {
                    isLogin ? 
                    <div className='mx-4'> (Hi {username.toUpperCase()})
                        <button onClick={handleLogout} className="inline-flex items-center bg-black text-white border-0 py-1 px-3 focus:outline-none rounded text-base mx-4 mt-4 md:mt-0">Logout
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                    :
                    <Link to="/login">
                        <button className="inline-flex items-center bg-black text-white border-0 py-1 px-3 focus:outline-none rounded text-base mx-4 mt-4 md:mt-0">Login
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </Link>
                } 
            </div>
        </header>  
    )
}

export default Navbar