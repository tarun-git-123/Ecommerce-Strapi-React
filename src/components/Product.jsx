import React from 'react';
import {URL} from './utils/Constants';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from './utils/cartSlice';
import usePreviousPath from './hooks/usePreviousPath';

const Product = (props) => {
    const cartItems = useSelector( (store) => store.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {resData} = props;
    const {name,price,retail_price,image,isBestSeller} = resData?.attributes;

    const goTo = ()=>{
        navigate('product-details/'+resData.id);
    }

    const handleAddToCart = ()=>{
        const item = {
            id:resData.id,
            name:name,
            qty:1,
            price:price,
            retail_price:retail_price,
            isBestSeller:isBestSeller,
            image:image.data[0].attributes.formats.thumbnail.url
        }
        dispatch(addItem(item))
    }
    return (
        <div className="w-full grid grid-cols-[30%_70%] gap-2 sm:grid-cols-1 shadow-lg bg-white p-4 rounded-lg cursor-pointer relative">
            {isBestSeller && <span className=" w-auto flex justify-center rounded-tl-lg items-center px-3 py-1 bg-red-400 text-xs font-medium text-white absolute z-[1] shadow-inner">Best Seller</span>}

            <div className="block relative sm:h-48 h-[250px] rounded overflow-hidden group" onClick={goTo}>
                {image.data && <img alt="ecommerce" className="object-contain w-full h-full block transition-transform duration-300 ease-linear transform group-hover:scale-125" src={URL + image.data[0].attributes.formats.small.url} />}
            </div>
            <div className="mt-10 sm:mt-4">
                <h2 className="text-gray-900 title-font text-sm font-medium h-[70px]" onClick={goTo}>{name}</h2>
                <div className='flex flex-col items-start sm:justify-center sm:items-center'>
                    <p className='py-2 font-semibold'><del className='text-[14px] font-medium text-gray-500 mx-[6px]'>${(retail_price).toFixed(2)}</del><span className='text-[18px]'>${price.toFixed(2)}</span></p>
                    <Link className='text-black text-center text-[13px] font-medium px-4 w-[80%] sm:w-[70%] h-8 leading-[30px] bg-[#ffd814] hover:bg-yellow-400 rounded-[20px]' onClick={handleAddToCart}>Add to Cart</Link>
                </div>
            </div>
        </div>
    )
}

export default Product