import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch} from "react-redux";
import { clearCart } from './utils/cartSlice';
const ThankYou = () => {
  const {orderId} = useParams();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(clearCart());
    localStorage.removeItem('items');
    localStorage.removeItem('address_id');
  },[]);

  return (
    <>
        <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
            <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="ml-3 text-xl font-bold">MyShop</span>
            </Link>
            <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
                <div className="relative">
                    <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
                        <li className="flex items-center space-x-3 text-left sm:space-x-4">
                            <a className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-700" href="#"
                            ><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg
                                ></a>
                            <span className="font-semibold text-gray-900">Shop</span>
                        </li>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <li className="flex items-center space-x-3 text-left sm:space-x-4">
                            <Link to="#" className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-700" href="#"
                            ><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg
                                ></Link>
                            <span className="font-semibold text-gray-900">Shipping</span>
                        </li>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <li className="flex items-center space-x-3 text-left sm:space-x-4">
                            <Link to="#" className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-700" href="#"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg
                                >
                            </Link>
                            <span className="font-semibold text-gray-500">Payment</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <h1 className='text-center text-3xl font-medium mt-10 text-green-700'>Thank You for Your Order!</h1>
        {orderId && <p className='text-center text-xl font-medium mt-4'>Your order ID is : #{orderId}</p>}
    </>
  );
};

export default ThankYou;
