import React, { useEffect, useState } from 'react'
import { SINGLE_PRODUCT_API } from '../utils/Constants';

const useSingleProductDetails = (pid) => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const response = await fetch(SINGLE_PRODUCT_API+pid+"?populate=*");
                if(!response.ok){
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                setProduct(result.data.attributes);
                
            } catch (error){
                setError(error.message)
            } finally{
                setIsLoading(false)
            }
        }
        fetchData();
    },[]);

    return{
        product,
        error,
        isLoading
    }
    
    
}

export default useSingleProductDetails