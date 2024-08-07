import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_TOKEN, EXP_MONTH, EXP_YEAR, ORDER_API, ORDER_DETAIL_API, getCurrentDateTime } from './utils/Constants';
import useGetLastOrderId from './hooks/useGetLastOrderId';

const Payment = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [paymentType, setPaymentType] = useState('COD');
    const [isCard, setIsCard] = useState(false);
    const [btnText, setBtnText] = useState('Place Order');
    const [btnDisabled, setBtnDisabled] = useState(false);
    const storedItems = JSON.parse(localStorage.getItem('items'));
    const storedAuth = JSON.parse(localStorage.getItem('Auth'));
    const address_id = localStorage.getItem('address_id');
    const [errors, setErrors] = useState({});
    const lastOrderId = useGetLastOrderId();
    const [formData, setFormData] = useState({
        cardNo: '',
        expMonth: '00',
        expYear: '00',
        cvv: ''
    });

    useEffect(() => {
        if (storedItems) {
            setCartItems(storedItems)
        }
        if (storedAuth) {
            setUserId(storedAuth.user.id)
        }
    }, [userId])

    const cartTotal = storedItems.reduce((total, item) => {
        return total + item.price * item.qty;
    }, 0);

    const handlePaymentType = (event) => {
        setErrors({})
        if (event.target.value == 'COD') {
            setIsCard(false)
        } else {
            setIsCard(true)
        }
        setPaymentType(event.target.value);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    const validate = () => {
        const newErrors = {};
        const cardNoPattern = /^\d{16}$/;
        const cvvPattern = /^\d{3}$/;

        if (!formData.cardNo.match(cardNoPattern)) {
            newErrors.cardNo = "Card number must be 16 digits";
        }
        if (formData.expMonth === '') {
            newErrors.expMonth = "Please select an expiration month";
        }
        if (formData.expYear === '') {
            newErrors.expYear = "Please select an expiration year";
        }
        if (!formData.cvv.match(cvvPattern)) {
            newErrors.cvv = "CVV must be 3 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setBtnDisabled(true);
        setBtnText('Please wait ...');
        if(paymentType === 'COD' || validate()){
            handlePlaceOrder()
        }
    }

    const handlePlaceOrder = async () => {
        try {
            const orderData = createOrderData();
            const orderResponse = await postData(ORDER_API, orderData);
            if (orderResponse && orderResponse.data && orderResponse.data.id) {
                await placeOrderDetails(orderResponse.data.id);
                setBtnDisabled(false);
                setBtnText('Place Order');
                navigate(`/thank-you/${orderResponse.data.attributes.order_id}`);
            }
        } catch (error) {
            console.error('Order Placement Error:', error);
            setErrors(error.message);
            setBtnDisabled(false);
            setBtnText('Place Order');
        }
    };

    const createOrderData = () => ({
        data: {
            order_id: Number(lastOrderId + 1),
            user_id: userId,
            address_id: address_id,
            sub_total: cartTotal,
            shipping_price: 0,
            discount: 0,
            total_price: cartTotal,
            order_statue: "pending",
            payment_status: "pending",
            payment_type: paymentType,
            cardNumber: formData.cardNo,
            exp_month: formData.expMonth,
            exp_year: formData.expYear,
            cvv: formData.cvv,
            date: getCurrentDateTime()
        }
    });

    const placeOrderDetails = async (order_id) => {
        try {
            const orderDetails = cartItems.map((item, index) => ({
                order_id: order_id,
                user_id: userId,
                product_id: item.id,
                price: item.price,
                quantity: item.qty
            }));

            const promises = orderDetails.map((detail) => (
                postData(ORDER_DETAIL_API, { data: detail })
            ));

            const responses = await Promise.all(promises);
            
            responses.forEach(response => {
                if (!response.ok) {
                  throw new Error(`Failed to post order detail: ${response.error.message}`);
                }
            });
            console.log('Order details created successfully:', responses);

        } catch (error) {
            console.error('Order Details Error:', error);
            setErrors(error.message);
        }
    }

    const postData = async (url, data) => {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + API_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            const result = await response.json();
            if (response.status === 404) {
                throw new Error('Resource not found');
            } else if (response.status >= 400 && response.status < 500) {
                throw new Error(result.error.message || 'Bad Request');
            } else if (response.status >= 500) {
                throw new Error('Server error, please try again later');
            } else {
                throw new Error('Something went wrong');
            }
        }

        return response.json();
    };

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
                                <Link to="/checkout" className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-700" href="#"
                                ><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg
                                    ></Link>
                                <span className="font-semibold text-gray-900">Shipping</span>
                            </li>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            <li className="flex items-center space-x-3 text-left sm:space-x-4">
                                <a className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white" href="#">3</a>
                                <span className="font-semibold text-gray-500">Payment</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-10 mx-auto w-[40%] bg-gray-50 px-4 pt-8 lg:mt-0">
                <p className="text-xl font-medium">Payment Details</p>
                <p className="text-gray-400">Complete your order by providing your payment details.</p>
                <div className='grid grid-cols-1 mt-3'>
                    <div className='flex'>
                        <input type="radio" name="payment_type" id="COD" checked={paymentType == 'COD'} value="COD" className='w-[15px] h-[15px] mx-3 mt-2 ' onChange={handlePaymentType} />
                        <label htmlFor='COD' className='text-lg cursor-pointer'>Cash On Delivery</label>
                    </div>
                    <div>
                        <input type="radio" name="payment_type" id="CARD" checked={paymentType == 'CARD'} value="CARD" className='w-[15px] h-[15px] mx-3 mt-2' onChange={handlePaymentType} />
                        <label htmlFor='CARD' className='text-lg cursor-pointer' >Payment on Card</label>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        {isCard &&
                            <div>
                                <label htmlFor="card-no" className="mt-4 mb-2 block text-sm font-medium">Card Details</label>
                                <div className="grid">
                                    <div className="relative grid grid-cols-1">
                                        <div>
                                            <input type="text" id="card-no" name="cardNo" value={formData.cardNo} onChange={handleChange} className="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Enter your card number" />
                                            <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                                                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z" />
                                                    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.cardNo && <p className="text-red-500 text-sm">{errors.cardNo}</p>}
                                    </div>
                                    <div className='grid grid-cols-3 gap-2 my-3'>
                                        <div>
                                            <label htmlFor="exp-month">Month</label>
                                            <select className='w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500' id='exp-month' name='expMonth' value={formData.expMonth} onChange={handleChange}>
                                                <option value='0'>Month</option>
                                                {
                                                    EXP_MONTH.map((month) => (
                                                        <option value={month} key={month}>{month}</option>
                                                    ))
                                                }
                                            </select>
                                            {errors.expMonth && <p className="text-red-500 text-sm">{errors.expMonth}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="exp-year">Year</label>
                                            <select className='w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500 text-left' id='exp-year' name='expYear' value={formData.expYear} onChange={handleChange}>
                                                <option value='0'>Year</option>
                                                {
                                                    EXP_YEAR.map((year) => (
                                                        <option value={year} key={year}>{year}</option>
                                                    ))
                                                }
                                            </select>
                                            {errors.expYear && <p className="text-red-500 text-sm">{errors.expYear}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor='cvv'>CVV</label>
                                            <input type="text" id="cvv" name="cvv" value={formData.cvv} onChange={handleChange} className="flex-shrink-0 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="CVV" />
                                            {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                                        </div>

                                    </div>

                                </div>
                            </div>
                        }

                        <div className="mt-6 border-t border-b py-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                                <p className="font-semibold text-gray-900">${cartTotal.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Shipping</p>
                                <p className="font-semibold text-gray-900">$0.00</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Total</p>
                            <p className="text-2xl font-semibold text-gray-900">${cartTotal.toFixed(2)}</p>
                        </div>
                    </div>

                    <button disabled={btnDisabled} className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">{btnText}</button>
                </form>
            </div>
        </>
    )
}

export default Payment