import axios from "axios";
// import { registerIndieID, unregisterIndieDevice } from "native-notify";
import { usePushNotification } from "../../../usePushNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://globeesex.com/api/users";
export const GENERAL_URL = "https://globeesex.com/api/general";
let allEnd = false;

export const allEndpoints = async (key) =>{
    // let profile = await getProfile(key);
    // let rates = await getRates();

    // if(allEnd){
    //     return {
    //         profile: profile,
    //         rate: rates
    //     }
    // }
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
        // registerIndieID(value, 14312, 'NRKYt9PycbIzkLWoNHDK1o');
        // return dataRate;
    }).catch((err)=>{
        console.error(err)
    })
}

export const primePercent = (value) =>{
    const percent = 0.10;

    const result = eval(value * percent);

    return result;
}

// export const sendpush = (title, message, token) => {
//     const axios = require('axios');
//     let data = JSON.stringify({
//     "subID": token,
//     "appId": 14312,
//     "appToken": "NRKYt9PycbIzkLWoNHDK1o",
//     "title": title,
//     "message": message
//     });

//     let config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: 'https://app.nativenotify.com/api/indie/notification',
//     headers: { 
//         'Content-Type': 'application/json'
//     },
//     data : data
//     };

//     axios.request(config)
//     .then((response) => {
//     console.log(JSON.stringify(response.data));
//     })
//     .catch((error) => {
//     console.log(error);
//     });
// //     axios.post(`https://app.nativenotify.com/api/indie/notification`, {
// //         subID: `${token}`,
// //         appId: 14312,
// //         appToken: 'NRKYt9PycbIzkLWoNHDK1o',
// //         title: `${title}`,
// //         message: `${message}`,
// //         bigPictureURL: "https://images.wixstatic.com/media/333ee9_55eceb62dec0461cbdef1b5ac0481fad~mv2.png/v1/fit/h_180,q_100,w_692,al_c,lg_0/333ee9_55eceb62dec0461cbdef1b5ac0481fad~mv2.png"
// //    }).then((result)=>{
// //     console.log(result);
// //    }).catch((err)=>{
// //     console.log(err)
// //    })
// }

// export const unregisterID = (key) =>{
//     unregisterIndieDevice(key, 14312, 'NRKYt9PycbIzkLWoNHDK1o');
// }