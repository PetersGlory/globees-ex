import axios from "axios";
// import { registerIndieID, unregisterIndieDevice } from "native-notify";
import { usePushNotification } from "../../../usePushNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://globeesex.com/api/users" // "http://192.168.0.108:4343/api/users";
export const GENERAL_URL = "https://globeesex.com/api/general" // "http://192.168.0.108:4343/api/general";
let allEnd = false;
export const NumberFormatter = ( x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const allEndpoints = async (key) =>{
 
}

// Getting Profile
export const getProfile = (key) =>{
    axios.request({
        method: 'GET',
        url: `${BASE_URL}/profile`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: 'Bearer '+key
        }
    }).then((response)=>{
        let dataUser = response.data.data;
        return dataUser;
    }).catch((err)=>{
        console.error(err)
    })
}

// Getting Rates
export const updatedevicetoken = async (email, value) =>{
    const expoPushToken = await AsyncStorage.getItem('pushToken');
    let datas = {
        user_type: "user",
        token: expoPushToken?.data,
        email: email
    }
    axios.request({
        method: 'POST',
        url: `${GENERAL_URL}/device_token`,
        data: datas,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    }).then((response)=>{
        console.log(response.data);
    }).catch((err)=>{
        console.error(err)
    })
}

export const primePercent = (value) =>{
    const percent = 0.08;

    const result = eval(value * percent);

    return result;
}

export const btcHandler = async (value) => {
    axios.request({
        method: 'GET',
        url: `https://blockchain.info/tobtc?currency=USD&value=${value}`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    }).then((response)=>{
        // console.log()
        return JSON.stringify(response.data);
    }).catch((err)=>{
        console.error(err)
    })
}
