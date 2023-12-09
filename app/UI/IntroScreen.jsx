import React, { useEffect } from 'react'
import { View, Text, SafeAreaView, Image } from 'react-native'
import tw from 'twrnc'
import PrimaryBtn from '../Components/common/PrimaryBtn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useDispatch} from "react-redux"
import { setAccessToken, setRates, setUserProfile } from '../config/redux/slice'
import { BASE_URL, GENERAL_URL } from '../config/api/Index'
import axios from 'axios'
import { usePushNotification } from '../../usePushNotification'

const IntroScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const btnGetstarted = () =>{
        navigation.push("LoginScreen")
    }
    useEffect(()=>{
      getToken()
    })

    const getToken = async () =>{
      // let accessTokens = await AsyncStorage.setItem('accessToken', '');
      let accessToken = await AsyncStorage.getItem('accessToken');
      console.log(accessToken);
      if(accessToken !== null & accessToken !== ""){
        dispatch(setAccessToken(accessToken))
        getProfile(accessToken)
        getRates();
        navigation.replace("HomeScreen")
      }
    }

    // Getting Profile
    const getProfile = (key) =>{
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
          dispatch(setUserProfile(dataUser));
          updateToken(dataUser.email);
      }).catch((err)=>{
          console.error(err)
      })
    }

    // Getting Rates
    const getRates = () =>{
      axios.request({
          method: 'GET',
          url: `${GENERAL_URL}/rates`
      }).then((response)=>{
          let dataRate = response.data.message;
          dispatch(setRates(dataRate));
      }).catch((err)=>{
          console.error(err)
      })
    }

    const updateToken =(email)=>{
      const {expoPushToken} = usePushNotification();
      console.log(expoPushToken)
      let datas = {
        user_type: "user",
        token: expoPushToken,
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
  return (
    <SafeAreaView style={tw`flex-grow w-full h-full bg-white`}>
      {/* <View style={tw`flex-1`} /> */}
      <View style={tw`flex-1`} />
      <View style={tw`flex-1 w-full h-full`}>
        <Image source={require("../../assets/img/intro.png")} alt='intro' />
      </View>
      <View style={tw`flex-1`} />
      <View style={tw`flex-1`} />
      <View style={tw`flex-1`} />
      <View style={{
        ...tw`bg-white h-[45%] p-8 pt-10`,
        flexShrink: 0,
        boxShadow: '0px -35px 25px 0px #FFF',
      }}>
        <Text style={{
            ...tw`text-2xl text-center`,
            // fontFamily: "Roboto",
            fontWeight:700,
            color: "#133A64",
        }}>
           SIMPLE & SECURED TRANSACTION!
        </Text>
        <Text style={tw`text-[13px] text-gray-500 p-4 text-center`}>
          A secured financial company that renders swift exchange and online payment solution. Instantly transfer 
          money abroad for family, friends, tuition, bills or expenses.
        </Text>
        <PrimaryBtn title={"Get Started"} onpressed={btnGetstarted} />
      </View>
        {/* <View style={styles.root}>
            
        </View> */}
    </SafeAreaView>
  )
}

export default IntroScreen