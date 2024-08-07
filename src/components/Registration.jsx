import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { API_TOKEN, REGISTRATION_API } from './utils/Constants';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addAuth } from './utils/authSlice';
const Registration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, formState: { errors }, handleSubmit, reset } = useForm();
    const [btnText, setBtnText] = useState('Sign Up');
    const [btnDisabled, setBtnDisabled] = useState(false);
    const authUser = useSelector((store)=>store.auth.authData);

    const onSubmit = async(data)=>{
        setBtnDisabled(true);
        setBtnText('Please wait ...');
        try{
            const options = {
                method:'POST',
                headers:{
                    'Authorization':'Bearer '+API_TOKEN,
                    'Content-Type':'Application/json'
                },
                body: JSON.stringify(data)
            }
            const response = await fetch(REGISTRATION_API, options);

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
            if(result.user){
                dispatch(addAuth(result))
                // window.localStorage.setItem('Auth',JSON.stringify(result))
                // toast.success('You have successfully registered',{position:'top-right' });
                setBtnDisabled(false);
                setBtnText('Sign Up');
                reset()
                navigate('/');
            }
        }catch(error){
            setBtnDisabled(false);
            setBtnText('Sign Up');
            toast.error(`${error.message}`,{position:'top-right' })
        }
    }

    useEffect(()=>{
        if(authUser && authUser.user && authUser.user.id){
            navigate('/');
        }
    },[authUser])

    return (
        <>
            <div className='mx-auto max-w-md rounded-xl border px-4 py-10 sm:px-8'></div>
            <div className="mx-auto max-w-md rounded-xl border px-4 py-10 text-gray-700 shadow-lg sm:px-8 mt-10">
                <div className="mb-16 flex justify-between ">
                    <span className="font-bold"><span className="inline-block h-3 w-3 bg-blue-600"></span> MyShop</span>
                    <span className="">Have account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Sign In</Link></span>
                </div>
                <p className="mb-5 text-3xl font-medium">Sign Up</p>
                <p className="mb-6 text-sm"></p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <div className="flex-col focus-within:border-blue-600 relative mb-3 flex overflow-hidden transition">
                            <input {...register("username", { required: true, minLength: 3, maxLength: 10 })} type="text" id="username" className="w-full flex-1 appearance-none border-[2px] border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:rounded-xl focus:transition focus:duration-500" placeholder="Username"/>
                            { errors?.username?.type === "required" && (<p role="alert" className='text-red-600 text-base font-normal'>Username field is required</p>)}
                            { errors?.username?.type === "minLength" && (<p role="alert" className='text-red-600 text-base font-normal'>Username must be between 3 to 10 character</p>)}
                        </div>
                        
                        <div className="focus-within:border-b-blue-500 relative mb-3 flex flex-col overflow-hidden transition">
                            <input {...register("email", { required: true, pattern:/[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/})} type="email" id="email" className="w-full flex-1 appearance-none border-[2px] border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:rounded-xl focus:transition focus:duration-500" placeholder="Email" />
                            { errors?.email?.type === "required" && (<p role="alert" className='text-red-600 text-base font-normal'>Email field is required</p>)}
                            { errors?.email?.type === "pattern" && (<p role="alert" className='text-red-600 text-base font-normal'>Email should be valid format</p>)}
                        </div>
                        <div className="focus-within:border-b-blue-500 relative mb-3 flex flex-col overflow-hidden transition">
                            <input {...register("password", { required: true, pattern:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/})} type="password" id="password" className="w-full flex-1 appearance-none border-[2px] border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:rounded-xl focus:transition focus:duration-500" placeholder="Password" />
                            { errors?.password?.type === "required" && (<p role="alert" className='text-red-600 text-base font-normal'>Password field is required</p>)}
                            { errors?.password?.type === "pattern" && (<p role="alert" className='text-red-600 text-base font-normal'>Password must be contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character</p>)}
                        </div>
                        
                    </div>
                    <button disabled={btnDisabled} className="mb-6 rounded-xl bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 w-full ">{btnText}</button>
                </form>
            </div>
            <ToastContainer/>
        </>
    )
}

export default Registration