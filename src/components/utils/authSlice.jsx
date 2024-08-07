import { createSlice } from "@reduxjs/toolkit";

const getAuthData = ()=>{
    try {
        const authData = localStorage.getItem('Auth');
        return authData ? JSON.parse(authData):[];
    } catch (error) {
        console.log('could not get auth data', error)
        return [];
    }
}

const checkIsLogin = ()=>{
    try {
        const isLogin = JSON.parse(localStorage.getItem('isAuthenticated'));
        return isLogin;
    } catch (error) {
        console.log('could not get auth data', error)
        return false;
    }
}

console.log(checkIsLogin())

const setAuthData = (state)=>{
    try {
        const authData = JSON.stringify(state);
        localStorage.setItem('Auth',authData)
    } catch (error) {
        console.log('could not set auth data', error)
    }
}

const authSlice = createSlice({
    name:'auth',
    initialState:{
        authData:getAuthData(),
        isAuthenticated: checkIsLogin()
    },
    reducers:{
        addAuth:(state,action)=>{
            state.authData = action.payload;
            setAuthData(state.authData);
        },
        login:(state)=>{
            state.isAuthenticated=true;
            localStorage.setItem('isAuthenticated',"true");
        },
        logout:(state)=>{
            state.isAuthenticated=false;
            localStorage.setItem('isAuthenticated',"false");
            localStorage.setItem('Auth',[]);
        }
    }
})

export const {addAuth,login,logout} = authSlice.actions;
export default authSlice.reducer;