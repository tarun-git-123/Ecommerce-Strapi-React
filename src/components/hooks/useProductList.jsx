import React, { useEffect, useState } from 'react'
import { API_TOKEN, URL } from '../utils/Constants';

const useProductList = () => {
    const [listOfProducts, setListOfProducts] = useState([]);
    const [filterProducts, setFilterProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    "Authorization":"Bearer " + API_TOKEN,
                    "Content-Type":"Application/json"
                }

                const requestOptions = {
                    method: "GET",
                    headers: headers
                };
                
                const response = await fetch(`${URL}/api/products?populate=image`, requestOptions);
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                // console.log(response);
                const data = await response.json();
                setListOfProducts(data?.data);
                setFilterProducts(data?.data)
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData();
    }, []);

    return {
        listOfProducts,
        filterProducts,
        setListOfProducts,
        setFilterProducts,
        isLoading,
        error
    }
}

export default useProductList