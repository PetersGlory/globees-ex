import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Clipboard,
  Alert,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import { Platform } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import axios from "axios";
import { usePushNotification } from "@/usePushNotification";
import { selectAccessToken, selectBtc, selectCryptoData, selectExchange } from "@/hooks/redux/slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api/Index";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import LoadingModal from "@/components/common/Modals/LoadingModal";

const CryptoSuccessPage = () => {
  const params = useLocalSearchParams();
  const [modal, setModal] = useState(false);
  const exchangeed = useSelector(selectExchange);
  const transactionsData = useSelector(selectCryptoData);
  const typeR = params.category;
  const currency_from = params.currency_from;
  const currency_to = params.currency_to;
  const addresses = useSelector(selectBtc);
  const { expoPushToken } = usePushNotification();
  const key = useSelector(selectAccessToken);

  let address = addresses.find((rate: { name: any; }) => rate.name === currency_from);

  useEffect(() => {
    setPush();
  }, []);

  const setPush = async () => {
    if (expoPushToken?.data) {
      console.log(expoPushToken.data);
      await AsyncStorage.setItem("pushToken", expoPushToken.data);
    }
  };

  // Copying to clip board function
  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setString(text);
      alert("Wallet address copied to clipboard!");
    } catch (error) {
      console.error("Copy to clipboard failed: ", error);
    }
  };

  const handleContinue = async () => {
    // console.log(transactionsData)
    setModal(true);
    axios
      .post(`${BASE_URL}/transactions`, transactionsData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setModal(false);
          router.navigate({
            pathname:"/SuccessTransaction",
            params: {
              category: typeR,
            }
          });
        } else {
          setModal(false);
          Alert.alert("Error", "There was an error processing the transaction");
          // setTimeout(()=>{
          // },500)
        }
      })
      .catch((err) => {
        console.error(err.response.data);
        setModal(false)
      });
  };
  // const typeR = params.category;
  return (
    <SafeAreaView style={tw`flex flex-grow h-full w-full bg-[${PRIMARY_COLOR}]`}>
      <TouchableOpacity
        style={tw`absolute top-10 right-5`}
        onPress={() => router.back()}
      >
        <Icon name="close-circle-outline" color={"#ffffff"} size={30} />
      </TouchableOpacity>
      <View
        style={tw`w-full h-full items-center justify-center p-5 ${Platform.OS === "ios" ? "p-5 w-full h-full" : ""}`}
      >
        <Text style={tw`text-center font-bold text-gray-100 mb-4 text-[25px]`}>
          Wallet Address
        </Text>

        {currency_from == "BTC" && (
          <Image
            source={require("../assets/images/BTC.jpeg")}
            style={{
              width: 260,
              height: 260,
              resizeMode: "contain",
            }}
            alt={currency_from}
          />
        )}

        {currency_from == "USDT" && (
          <Image
            source={require("../assets/images/USDT.jpeg")}
            style={{
              width: 260,
              height: 260,
              resizeMode: "contain",
            }}
            alt={currency_from}
          />
        )}

        {currency_from == "ETH" && (
          <Image
            source={require("../assets/images/ETH.jpeg")}
            style={{
              width: 260,
              height: 260,
              resizeMode: "contain",
            }}
            alt={currency_from}
          />
        )}

        <Text
          style={tw`text-center flex flex-row font-bold w-full items-center justify-between text-[#133A64] text-sm bg-orange-100 rounded-md p-1 w-full mt-4`}
        >
          {address?.addresses}{" "}
          <Icon
            name="copy-outline"
            onPress={() => copyToClipboard(address?.addresses)}
            size={20}
            color={"#133A64"}
          />
        </Text>

        <Text style={tw`text-center text-gray-200 mt-5 text-[14px]`}>
          Scan the QR code or copy the {currency_from} address below to proceed
          with the transaction of {exchangeed?.to} {currency_from} to Globees Ex
        </Text>

        <View style={tw`items-center w-full mt-5`}>
          <PrimaryBtn title={"Continue"} onpressed={handleContinue} />
        </View>
      </View>
      <LoadingModal
        message={"Loading..."}
        isloading={true}
        visibility={modal}
        setVisibility={setModal}
      />
    </SafeAreaView>
  );
};

export default CryptoSuccessPage;
