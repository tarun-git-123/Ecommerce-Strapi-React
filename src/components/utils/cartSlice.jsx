import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

const getCartItems = ()=>{
    try{
        const cartItems = localStorage.getItem('items');
        return cartItems? JSON.parse(cartItems): [];
    }catch(error){
        console.error("Could not get state", error);
        return [];
    }
}

const setCartItems = (state)=>{
    try{
        const cartItems = JSON.stringify(state);
        localStorage.setItem('items',cartItems);
    }catch(error){
        console.error("Could not set state", error);
    }
}

const cartSlice = createSlice({
    name:'cart',
    initialState:{
        items:getCartItems()
    },
    reducers:{
        addItem : (state,action)=>{
            const itemIndex = state.items.findIndex((item)=> item.id==action.payload.id)
            if(itemIndex >=0 ){
                state.items[itemIndex].qty+=action.payload.qty
                toast.success(`${action.payload.name} is added to the cart again!`,
                {position:'bottom-left' })
            }else{
                state.items.push(action.payload);
                toast.success(`${action.payload.name} is added to the cart!`,
                {position:'bottom-left' })
            }
            setCartItems(state.items);
        },
        updateItem:(state,action)=>{
            const itemIndex = state.items.findIndex((item)=> item.id==action.payload.id)
            if(itemIndex >=0 ){
                state.items[itemIndex].qty = action.payload.qty;
                setCartItems(state.items);
                toast.success(`Quantity is updated to the cart!`,
                    {position:'bottom-left' })
            }
        },
        removeItem:(state,action)=>{
            const itemIndex = state.items.findIndex((item)=> item.id==action.payload.id)
            if(itemIndex >=0 ){
                state.items.splice(itemIndex,1);
                setCartItems(state.items);
                toast.success(` Item is deleted from the cart!`,
                    {position:'bottom-left' })
            }
        },
        clearCart:(state)=>{
            state.items = [];
            window.localStorage.setItem('items', []);
        }
    }
})

export default cartSlice.reducer;
export const {addItem,updateItem,removeItem,clearCart} = cartSlice.actions;