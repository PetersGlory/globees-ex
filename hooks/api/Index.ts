import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://globeesex.com/api/users" // "http://192.168.0.108:4343/api/users";
export const GENERAL_URL = "https://globeesex.com/api/general" // "http://192.168.0.108:4343/api/general";
export const PRIMARY_COLOR = "#03203E";

export const NumberFormatter = ( x: { toString: () => string; }) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Getting Profile
export const getProfile = (key: string) =>{
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
export const updatedevicetoken = async (email:string, value:string) =>{
    const expoPushToken = await AsyncStorage.getItem('pushToken');
    let datas = {
        user_type: "user",
        token: value || expoPushToken,
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

export const primePercent = (value: number) =>{
    const percent = 0.08;

    const result = value * percent;

    return result;
}

export const btcHandler = async (value: any) => {
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
