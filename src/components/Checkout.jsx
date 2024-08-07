import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { API_TOKEN, CUSTOMER_API, URL, USER_ADDRESS_API } from './utils/Constants';
import { login } from './utils/authSlice';
import { STATE } from './utils/Constants';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [addressId, setAddressId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [singleAddress, setSingleAddress] = useState({});
    const [error, setError] = useState(null);
    const [userAddresses, setUserAddresses] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [btnText, setBtnText] = useState('Add');
    const [btnDisabled, setBtnDisabled] = useState(false);
    const { register, formState: { errors }, handleSubmit, reset } = useForm();
    const [selectedOption, setSelectedOption] = useState('');
    const cartItems = useSelector((store)=>store.cart.items);
    const authData = useSelector((store)=>store.auth.authData);

    useEffect( ()=>{
        if (authData && authData.user && authData.user.id) {
            setUserId(authData.user.id)
        }
    },[]);

    const getAddress = async(userId)=>{
        try{
            const headers = {
                "Authorization":"Bearer " + API_TOKEN,
                "Content-Type":"Application/json"
            }

            const requestOptions = {
                method: "GET",
                headers: headers
            };
            const response = await fetch(`${USER_ADDRESS_API}${userId}?populate=*`,requestOptions);
            if(!response.ok){
                throw new Error("Network response was not ok")
            }
            const res = await response.json();
            //console.log(res);
            setUserAddresses(res.customers)
            setSelectedOption(res.customers[0].id);
            localStorage.setItem('address_id',res.customers[0].id);
        } catch(error){
            setError(error.message)
        }finally{
            setIsLoading(false)
        }
    }

    // get user address
    useEffect( ()=>{
        if(userId){
            getAddress(userId);
        }
    },[userId])

    // add address
    const onSubmit = async(data)=>{
        let newData;
        let method;
        let api_URL;
        let message;

        if(isEdit===true){
            newData = data;
            method = 'PUT';
            api_URL = CUSTOMER_API+addressId;
            message = "Your address is successfully updated";
        }else{
            newData = {...data, user_id:userId}
            method = 'POST';
            api_URL = CUSTOMER_API;
            message = "Your address is successfully added";
        }
        
        const payload = {
            data:newData
        }
        setBtnDisabled(true);
        setBtnText('Please wait ...');
        try{
            const options = {
                method:method,
                headers:{
                    'Authorization':'Bearer '+API_TOKEN,
                    'Content-Type':'Application/json'
                },
                body: JSON.stringify(payload)
            }
            const response = await fetch(api_URL, options);

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

            const result = await response.json();
            // console.log(result);
            if(result.data.id){
                toast.success(message,{position:'top-right' });
                setBtnDisabled(false);
                setBtnText('Add');
                reset({})
                getAddress(userId)
                setShowModal(false)
            }
        }catch(error){
            setBtnDisabled(false);
            setBtnText('Add');
            toast.error(`${error.message}`,{position:'top-right' })
        }
    }

    // edit single address
    const handleUserAddress = (id)=>{
        setAddressId(id)
        setIsEdit(true)
        setBtnText('Edit')
        setShowModal(true);
        getSingleAddress(id)
    }

    // Delete single address
    const handleDeleteAddress = (id)=>{
        if(confirm("Do you really want to delete this address?")){
            deleteSingleAddress(id)
        }
        
    }

    const deleteSingleAddress = async(id)=>{
        try{
            const headers = {
                "Authorization":"Bearer " + API_TOKEN,
                "Content-Type":"Application/json"
            }

            const requestOptions = {
                method: "DELETE",
                headers: headers
            };
            const response = await fetch(`${CUSTOMER_API}${id}`,requestOptions);
            if(!response.ok){
                throw new Error("Network response was not ok")
            }
            const res = await response.json();
            getAddress(userId)
            toast.error("Address deleted successfully",{position:'top-right' })
        } catch(error){
            setError(error.message)
        }finally{
            setIsLoading(false)
        }
    }
    
    const getSingleAddress = async (id)=>{    
        try{
            const headers = {
                "Authorization":"Bearer " + API_TOKEN,
                "Content-Type":"Application/json"
            }

            const requestOptions = {
                method: "GET",
                headers: headers
            };
            const response = await fetch(`${CUSTOMER_API}${id}`,requestOptions);
            if(!response.ok){
                throw new Error("Network response was not ok")
            }
            const res = await response.json();
            // setSingleAddress(res.data);
            // console.log(res.data);
            
            reset({
                firstName:res.data?.attributes?.firstName,
                lastName:res.data?.attributes?.lastName,
                phone:res.data?.attributes?.phone,
                address:res.data?.attributes?.address,
                city:res.data?.attributes?.city,
                zip:res.data?.attributes?.zip,
                state:res.data?.attributes?.state,
                country:res.data?.attributes?.country
            })
            setShowModal(true)
        } catch(error){
            setError(error.message)
        }finally{
            setIsLoading(false)
        }
    }

    const handleAddressChange = (event)=>{
        setSelectedOption(event.target.value);
        localStorage.setItem('address_id',event.target.value);
        console.log(selectedOption)
    }

    const cartTotal = cartItems.reduce((total, item)=>{
        return total + item.price * item.qty;
    },0);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (error) {
        return <h1>Error: {error}</h1>;
    }
    if (userAddresses===null) {
        return <h1>No address found</h1>;
    }

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
                                <a className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white ring ring-gray-600 ring-offset-2" href="#">2</a>
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
            <div className="grid sm:px-10 lg:grid-cols-[60%_40%] lg:px-20 xl:px-32">
                <div>
                    <p className="mt-8 text-lg font-medium">Shipping Address</p>
                    <div className="mt-5 border-2 border-gray-300 px-6 py-3 rounded-lg">
                        <h1 className='text-xl font-bold border-b py-2 border-gray-400'>Your Address </h1>
                        {
                            userAddresses.map(({id,firstName,lastName,address,city,state,country,zip})=>(
                                <div key={id} className={`mt-3 border px-3 py-2 flex cursor-pointer ${selectedOption == id ? 'bg-yellow-50 border-yellow-400' : ''}`}>
                                    <input type="radio" name='address' className='w-[20px] h-[20px] mt-1' id={id} value={id} checked={selectedOption==id} onChange={handleAddressChange}/>
                                    <label htmlFor={id} className='mx-2'>
                                        <span className='font-medium'>{firstName+' '+lastName} </span>
                                        <span>, {city}, {address}, </span>
                                        <span>{city}, </span>
                                        <span>{zip}, </span>
                                        <span>{state}, </span>
                                        <span>{country}</span>
                                        <Link onClick={() => handleUserAddress(id)} className='text-blue-600 hover:underline mx-3 text-sm'>Edit address</Link>

                                        <Link onClick={() => handleDeleteAddress(id)} className='text-red-600 hover:underline mx-1 text-sm'>Delete address</Link>
                                    </label>
                                </div>
                            ))
                        }

                        <div className='mt-2 mx-3'>
                            <Link onClick={() => {
                                setShowModal(true)
                                setIsEdit(false)
                                reset({})    
                            }}><span className='text-xl font-semibold mx-1'>+</span><span className='text-blue-600 hover:underline'>Add a new address</span></Link>
                        </div>
                    </div>
                </div>
                <div className="px-4 pt-8">
                    <p className="text-xl font-medium">Order Summary</p>
                    <p className="text-gray-400">Choose a shipping address and payment method to calculate shipping, handling and tax.</p>
                    <div className="mt-2 space-y-3 rounded-lg border bg-white px-2 py-2 sm:px-6">
                        {
                            cartItems.map(({id,image,name,price,retail_price,qty,isBestSeller})=>(
                                <div key={id} className="flex flex-col rounded-lg bg-white sm:flex-row">
                                    <img className="m-2 h-full w-[15%] rounded-md border object-cover object-center" src={URL+image} alt="" />
                                    <div className="flex w-full flex-col px-4 py-[5px]">
                                        <span className="font-semibold text-sm">{name}</span>
                                        <span className="float-right text-gray-400 text-sm">Qty :{qty} </span>
                                        <p className="font-bold text-sm">${(price*qty).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))
                        }
                        <div className='border-t flex justify-end'>
                            <h1 className='text-red-500 font-medium text-2xl pr-4 mt-2'>Order Total:    ${cartTotal.toFixed(2)}</h1>
                        </div>
                        <Link to="/payment">
                        <button className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">Proceed to Payment</button>
                        </Link>
                        
                    </div>
                </div>
            </div>

            {showModal ? (
                <>
                <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    <div className=" w-auto my-6 mx-auto max-w-3xl">
                        <div className="border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                <h3 className="text-xl font-semibold">
                                    {isEdit?'Edit':'Add'} Address
                                </h3>
                                <button
                                    className="p-1 ml-auto text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => {
                                        setShowModal(false);
                                        setBtnText('Add')
                                        setIsEdit(false)
                                        reset({}) 
                                    }
                                    }
                                >
                                    <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                    </span>
                                </button>
                            </div>
                        
                            <div className="p-6">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className='grid grid-cols-2 gap-4 mb-2'>
                                        <div className='grid grid-flow-row'>
                                            <label>First Name</label>
                                            <input {...register("firstName", { required: true, pattern:/[A-Za-z]{3,}/})} type='text' className='border outline-none p-2 mt-1' placeholder='Enter your first name'/>
                                            
                                            { errors?.firstName?.type === "required" && (<p role="alert" className='text-red-600 text-base font-normal'>First field is required</p>)}

                                            { errors?.firstName?.type === "pattern" && (<p role="alert" className='text-red-600 text-base font-normal'>First name should be string and min length is 3</p>)}
                                        </div>
                                        <div className='grid grid-flow-row'>
                                            <label>Last Name</label>
                                            <input {...register("lastName", {           
                                                    required:'Last name field is required', 
                                                    pattern:{
                                                        value:"/[A-Za-z]{3,}/",
                                                        message:"Last name should be string and min length is 3"
                                                    }
                                                })
                                            } type='text' className='border outline-none p-2 mt-1' placeholder='Enter your last name'/>

                                            {errors.lastName && <p className='text-red-600 text-base font-normal'>{errors.lastName.message}</p>}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 mb-2'>
                                        <div className='grid grid-flow-row'>
                                            <label>Phone</label>
                                            <input {...register('phone', {
                                                required: 'Phone number is required',
                                                pattern: {
                                                value: /^\d{10}$/,
                                                message: 'Phone number must be exactly 10 digits'
                                                }
                                            })} type='tel' className='border outline-none p-2 mt-1' placeholder='Enter your phone' />
                                            
                                            {errors.phone && <p className='text-red-600 text-base font-normal'>{errors.phone.message}</p>}
                                            
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 mb-2'>
                                        <div className='grid grid-flow-row'>
                                            <label>Address</label>
                                            <input {...register("address", {           
                                                required:'Address field is required'})} type='text' className='border outline-none p-2 mt-1' placeholder='Enter your address'/>
                                            {errors.address && <p className='text-red-600 text-base font-normal'>{errors.address.message}</p>}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4 mb-2'>
                                        <div className='grid grid-flow-row'>
                                            <label>City</label>
                                            <input {...register("city", {           
                                                required:'City field is required'})} type='text' className='border outline-none p-2 mt-1' placeholder='Enter your city'/>
                                            {errors.city && <p className='text-red-600 text-base font-normal'>{errors.city.message}</p>}
                                        </div>
                                        <div className='grid grid-flow-row'>
                                            <label>Zip / Pin</label>
                                            <input {...register("zip", {           
                                                required:'Zip code field is required',
                                                pattern:{
                                                    value: /^\d{6}$/,
                                                    message: 'Zip/Pin Code must be exactly 6 digits'
                                                }})} type='text' className='border outline-none p-2 mt-1' placeholder='Enter your Zip Code'/>
                                            {errors.zip && <p className='text-red-600 text-base font-normal'>{errors.zip.message}</p>}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4 mb-2'>
                                        <div className='grid grid-flow-row'>
                                            <label>State</label>
                                            <select {...register("state", {           
                                                required:'State field is required'})} className='border outline-none p-2 mt-1'>
                                            <option value="">Select State</option>
                                                {
                                                    STATE.map((state,index)=>(
                                                        <option value={state[1]}>{state[0]}</option>
                                                    ))
                                                }
                                            </select>
                                            {errors.state && <p className='text-red-600 text-base font-normal'>{errors.state.message}</p>}
                                        </div>
                                        <div className='grid grid-flow-row'>
                                            <label>Country</label>
                                            <select {...register("country")} className='border outline-none p-2 mt-1'>
                                                <option value="india">India</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end p-6 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => {
                                                setIsEdit(false);
                                                setBtnText('Add')
                                                setShowModal(false);
                                                reset({}) 
                                            }}
                                        >
                                            Close
                                        </button>
                                        <button disabled={btnDisabled} className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            >
                                            {btnText}
                                        </button>
                                    </div>
                                </form>
                            </div>  
                        </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            <ToastContainer/>
        </>
    )
}

export default Checkout