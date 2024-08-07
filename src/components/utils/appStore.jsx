import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import authSlice from "./authSlice";
const appStore = configureStore({
    reducer:{
        cart : cartSlice,
        auth : authSlice,
    }
})

export default appStore;