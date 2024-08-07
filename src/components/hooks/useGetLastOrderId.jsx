import React, { useEffect, useState } from 'react'
import { API_TOKEN, ORDER_API } from '../utils/Constants';

const useGetLastOrderId = () => {
    const [lastOrderId, setLastOrderId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const getOrderId = async()=>{
            try {
                const options = {
                    method:'GET',
                    headers:{
                        'Authorization':'Bearer '+API_TOKEN,
                        'Content-Type':'Application/json'
                    },
                }
                const response = await fetch(ORDER_API+"last-order-id",options);
                if(!response.ok){
                    throw new Error("Network issue");
                }
                const res = await response.json();
                setLastOrderId(res.lastOrderId);
            } catch (error) {
                setError("error : "+error)
            }
        }
        getOrderId();
    },[lastOrderId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (lastOrderId === null) {
        return <div>No data</div>;
    }else{
        return lastOrderId;
    }
}

export default useGetLastOrderId