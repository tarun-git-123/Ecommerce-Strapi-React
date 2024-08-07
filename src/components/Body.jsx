import React from 'react'
import { useState, useEffect } from 'react';
import Product from './Product';
import { Link } from 'react-router-dom';
import Description from './Description';

import useProductList from './hooks/useProductList';
import { ToastContainer } from 'react-toastify';

const Body = () => {
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // state to manage sort order
    const {listOfProducts,setListOfProducts,filterProducts,setFilterProducts,isLoading,error} = useProductList(); //custom hook

    const handleSearch = () => {
        let filteredData = filterProducts.filter((product) => {
            return product?.attributes?.name.toLowerCase().includes(searchText.toLowerCase());
        });

        if (sortOrder === 'low_to_high') {
            console.log('low-to');
            filteredData = filteredData.sort((a, b) => a.attributes.price - b.attributes.price);
        } else if (sortOrder === 'high_to_low') {
            console.log('high-to');
            filteredData = filteredData.sort((a, b) => b.attributes.price - a.attributes.price);
        }

        setListOfProducts(filteredData);

        if (filteredData.length === 0) {
            setErrorMessage('No products found');
        } else {
            setErrorMessage('');
        }
    }

    const handleSort = (e) => {
        setSortOrder(e.target.value);
    }

    useEffect(() => {
        handleSearch(); // reapply the search and sort whenever searchText or sortOrder changes
    }, [sortOrder, filterProducts, setListOfProducts]);

    if (isLoading) return <div>Loading...</div>

    if (error) return <div>Error: {error}</div>

    return (
        <>
            <section className="text-gray-600 body-font bg-gray-200 py-8 z-0">
                <div className="w-[90%] container m-auto">
                    <div className='flex'></div>
                    <div className='mt-20 flex w-[40%]'>
                        <input type="search" name='search' value={searchText} className='outline-none border-gray-400 border-2 w-full b bg-gray-200 placeholder:text-gray-500 pl-4 rounded-lg' placeholder='Search Here..' onChange={(e)=>setSearchText(e.target.value)}/>

                        <button className="mx-2 text-sm font-medium hover:text-white  bg-gray-400 hover:bg-gray-500 border-0 px-6 h-[40px] leading-[40px] focus:outline-none rounded-md" onClick={handleSearch}>Search</button>

                        <select className='bg-gray-400 w-full rounded-lg text-sm font-medium pl-4' onChange={(e)=>handleSort(e)} value={sortOrder}>
                            <option value="">Sort By</option>
                            <option value="low_to_high">Price Low to High</option>
                            <option value="high_to_low">Price High to Low</option>
                        </select>
                    </div>
                    {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
                    { 
                    listOfProducts && <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6 sm:mt-[10px] mt-[100px]">
                        {listOfProducts.map((product) => (
                            <Product resData={product} key={product.id} />
                        ))}
                    </div>
                    }
                </div>
            </section>
            <Description />
            <ToastContainer />
        </>
    );
};

export default Body;
