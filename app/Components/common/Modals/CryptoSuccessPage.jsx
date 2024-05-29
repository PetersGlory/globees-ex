import React, { useEffect, useState } from "react";
import { StackActions, useNavigation } from "@react-navigation/native";
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
import PrimaryBtn from "../PrimaryBtn";
import { useSelector } from "react-redux";
import {
  selectAccessToken,
  selectBtc,
  selectCryptoData,
  selectExchange,
  selectRates,
  selectReceiver,
  selectUserProfile,
} from "../../../config/redux/slice";
import QRCode from "react-native-qrcode-svg";
import { usePushNotification } from "../../../../usePushNotification";
import CustomHeader from "../CustomHeader";
import { BASE_URL } from "../../../config/api/Index";
import LoadingModal from "./LoadingModal";
import axios from "axios";

const CryptoSuccessPage = ({ route }) => {
  const navigator = useNavigation();
  const [modal, setModal] = useState(false);
  const exchangeed = useSelector(selectExchange);
  const transactionsData = useSelector(selectCryptoData);
  const typeR = route.params.category;
  const currency_from = route.params.currency_from;
  const currency_to = route.params.currency_to;
  const addresses = useSelector(selectBtc);
  const { expoPushToken } = usePushNotification();
  const key = useSelector(selectAccessToken);

  let address = addresses.find((rate) => rate.name === currency_from);

  useEffect(() => {
    setPush();
  }, []);

  const setPush = async () => {
    console.log(expoPushToken?.data);
    await AsyncStorage.setItem("pushToken", expoPushToken?.data);
  };

  // Copying to clip board function
  const copyToClipboard = async (text) => {
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
          navigator.navigate("SuccesScreen", {
            category: typeR,
          });
          // setTimeout(()=>{
          // },500)
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
  // const typeR = route.params.category;
  return (
    <SafeAreaView style={tw`flex flex-grow h-full w-full bg-[#20242d]`}>
      <TouchableOpacity
        style={tw`absolute top-10 right-5`}
        onPress={() => navigator.goBack()}
      >
        <Icon name="close-circle-outline" color={"#ffffff"} size={30} />
      </TouchableOpacity>
      <View
        style={tw`w-full h-full items-center justify-center p-5 ${
          Platform.OS == "ios" && "p-5 w-full h-full"
        }`}
      >
        <Text style={tw`text-center font-bold text-gray-100 mb-4 text-[25px]`}>
          Wallet Address
        </Text>

        {currency_from == "BTC" && (
          <Image
            source={require("../../../../assets/img/BTC.jpeg")}
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
            source={require("../../../../assets/img/USDT.jpeg")}
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
            source={require("../../../../assets/img/ETH.jpeg")}
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
