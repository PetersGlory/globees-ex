import React, { useCallback, useEffect } from "react";
import { View, Text, SafeAreaView, Image } from "react-native";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { BASE_URL, GENERAL_URL, PRIMARY_COLOR } from "@/hooks/api/Index";
import SecondaryBtn from "@/components/common/SecondaryBtn";
import { setAccessToken, setBtc, setRates, setUserProfile } from "@/hooks/redux/slice";

const IntroScreen = () => {
  const dispatch = useDispatch();
  const btnGetstarted = () => {
    router.push("LoginScreen" as never);
  };
  useFocusEffect(
    useCallback(() => {
      getToken();
    }, [])
  );
  useEffect(() => {
    getToken();
  });

  const getToken = async () => {
    // let accessTokens = await AsyncStorage.setItem('accessToken', '');
    let accessToken:string | null = await AsyncStorage.getItem("accessToken");
    console.log(accessToken);
    if ((accessToken !== null) && (accessToken !== "")) {
      dispatch(setAccessToken(accessToken));
      getProfile(accessToken);
      getRates();
      getCryptoAddress();
      router.replace("/(tabs)");
    }
  };

  // Getting Profile
  const getProfile = (key:string) => {
    axios
      .request({
        method: "GET",
        url: `${BASE_URL}/profile`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
      })
      .then((response) => {
        let dataUser = response.data.data;
        dispatch(setUserProfile(dataUser));
        updateToken(dataUser.email);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Getting Rates
  const getRates = () => {
    axios
      .request({
        method: "GET",
        url: `${GENERAL_URL}/rates`,
      })
      .then((response) => {
        let dataRate = response.data.message;
        dispatch(setRates(dataRate));
      })
      .catch((err) => {
        console.error(err);
      });
  };
// getting crypto addresses
  const getCryptoAddress = () => {
    axios
      .request({
        method: "GET",
        url: `${GENERAL_URL}/crypto_addresses`,
      })
      .then((response) => {
        let dataRate = response.data.message;
        dispatch(setBtc(dataRate));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateToken = async (email:string) => {
    const expoPushToken = await AsyncStorage.getItem("pushToken");
    let datas = {
      user_type: "user",
      token: expoPushToken,
      email: email,
    };
    axios
      .request({
        method: "POST",
        url: `${GENERAL_URL}/device_token`,
        data: datas,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <SafeAreaView style={tw`flex-grow w-full h-full bg-[${PRIMARY_COLOR}]`}>
      <StatusBar style="light" />
      <View style={tw`flex-1`} />
      <View style={tw`flex-1 w-full h-full items-center`}>
        <Text style={[tw`text-white text-center text-5xl font-bold mb-5 mt-5 uppercase`]}>Globees Ex</Text>
        <Image source={require("../assets/images/logo.png")} style={{
          width: 200,
          height: 200,
        }} alt="intro" />
      </View>
      <View style={tw`flex-1`} />
      <View style={tw`flex-1`} />
      <View style={tw`flex-1`} />
      <View
        style={{
          ...tw`bg-white h-[45%] p-8 pt-10 rounded-t-8`,
          flexShrink: 0,
          boxShadow: "0px -5px 15px 0px #FFF",
        }}
      >
        <Text
          style={{
            ...tw`text-3xl font-bold text-center`,
            color: PRIMARY_COLOR,
          }}
        >
          Welcome back ...
        </Text>
        <Text style={tw`text-[15px] text-gray-500 p-4 text-center`}>
          Exchange your currency and send international payments online.
          Instantly transfer money to your family or friends, and swiftly pay towards your tuition fees, bills, and expenses.
        </Text>
        <View style={tw`flex flex-row items-center mt-5 justify-between`}>
          <View style={tw`w-[49%]`}>
            <SecondaryBtn title={"Login"} onpressed={btnGetstarted} />
          </View>
          <View style={tw`w-[49%]`}>
            <SecondaryBtn title={"Register"} onpressed={()=> router.push("RegistrationScreen" as never)} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IntroScreen;
