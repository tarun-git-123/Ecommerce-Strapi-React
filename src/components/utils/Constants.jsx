export const API_TOKEN = "4fb8448fd3f2c3e11b2e8df9a28b9b78575af43aaf411a4f8096ce893c8387b60b1a2d2595085f485e87c1599d18371287d3c9af0bf53cc283c8d6cf2d08915014c7607349989e14239c5ed2fb16c4deaa433870e30c6df58cb82c3a3bc6b49560cfe73be75264f75c1fb6d3645adac41a9c056ac66f20b1b7d99ee778927a9d";
export const URL = "http://localhost:1337";

export const SINGLE_PRODUCT_API = URL+"/api/products/";
export const REGISTRATION_API = URL+"/api/auth/local/register";
export const LOGIN_API = URL+"/api/auth/local/";
export const USER_ADDRESS_API = URL+"/api/users/";
export const CUSTOMER_API = URL+"/api/customers/";
export const ORDER_API = URL+"/api/orders/";
export const ORDER_DETAIL_API = URL+"/api/order-details/";

export const EXP_MONTH = ['01','02','03','04','05','06','07','08','09','10','11','12'];
export const EXP_YEAR = ['2024','2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035'];

export const getCurrentDateTime = () => {
    const currentDateTime = new Date();
  
    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateTime.getDate()).padStart(2, '0');
  
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const STATE = [
    ["Andhra Pradesh", "AP"],
    ["Arunachal Pradesh", "AR"],
    ["Assam", "AS"],
    ["Bihar", "BR"],
    ["Chhattisgarh", "CG"],
    ["Goa", "GA"],
    ["Gujarat", "GJ"],
    ["Haryana", "HR"],
    ["Himachal Pradesh", "HP"],
    ["Jammu and Kashmir", "JK"],
    ["Jharkhand", "JH"],
    ["Karnataka", "KA"],
    ["Kerala", "KL"],
    ["Madhya Pradesh", "MP"],
    ["Maharashtra", "MH"],
    ["Manipur", "MN"],
    ["Meghalaya", "ML"],
    ["Mizoram", "MZ"],
    ["Nagaland", "NL"],
    ["Odisha", "OD"],
    ["Punjab", "PB"],
    ["Rajasthan", "RJ"],
    ["Sikkim", "SK"],
    ["Tamil Nadu", "TN"],
    ["Telangana", "TS"],
    ["Tripura", "TR"],
    ["Uttarakhand", "UK"],
    ["Uttar Pradesh", "UP"],
    ["West Bengal", "WB"],
    ["Andaman and Nicobar Islands", "AN"],
    ["Chandigarh", "CH"],
    ["Dadra and Nagar Haveli", "DN"],
    ["Daman and Diu", "DD"],
    ["Delhi", "DL"],
    ["Lakshadweep", "LD"],
    ["Puducherry", "PY"]
] 
