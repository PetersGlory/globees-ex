import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { BASE_URL, GENERAL_URL, PRIMARY_COLOR, updatedevicetoken } from "@/hooks/api/Index";
import { setAccessToken, setRates, setUserProfile } from "@/hooks/redux/slice";
import { router, useLocalSearchParams } from "expo-router";
import SecondaryBtn from "@/components/common/SecondaryBtn";
import LoadingModal from "@/components/common/Modals/LoadingModal";

const VerificationScreen = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("Verifying....");
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  const handleLogin = () => {
    setMessage("Loading...");
    setModal(true);
    setLoading(true);
    let datas = {
      email: params?.email,
      codes: code,
    };
    if (code !== "") {
      axios
        .post(`${BASE_URL}/verify/code`, datas)
        .then(async (result) => {
          const datas = result?.data;
          setMessage(datas.message);
          if (!datas.error) {
            setLoading(false);
            await AsyncStorage.setItem("accessToken", datas?.accessToken);
            dispatch(setAccessToken(datas?.accessToken));
            await AsyncStorage.setItem("accessTokenF", datas?.accessToken);
            getProfile(datas?.accessToken);
            getRates();
            if (typeof params?.email === 'string') {
              updatedevicetoken(params.email, datas?.accessToken);
            }
            setModal(false);
            setTimeout(() => {
              router.replace("/(tabs)");
            }, 1500);
          } else {
            setTimeout(() => {
              // navigation.push("VerificationScreen");
              setModal(false);
              setLoading(false);
            }, 3000);
          }
        })
        .catch((err:any) => {
          setMessage(err.message);
          setTimeout(() => {
            // navigation.push("VerificationScreen");
            setModal(false);
            setLoading(false);
          }, 3000);
          console.log(err);
        });
    } else {
      setMessage("All fields are required.");
      setTimeout(() => {
        // navigation.push("VerificationScreen");
        setModal(false);
        setLoading(false);
      }, 3000);
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
        let dataUser = response?.data?.data;
        dispatch(setUserProfile(dataUser));
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
        let dataRate = response?.data?.message;
        dispatch(setRates(dataRate));
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <SafeAreaView
      style={tw`flex-grow w-full h-full bg-[${PRIMARY_COLOR}] p-5 pt-15`}
    >
      <StatusBar style="light" translucent={true} />
      <ScrollView
        style={tw`h-full w-full ${Platform.OS == "ios" ? " p-5 pt-15" : ""}`}
      >
        <TouchableOpacity
          style={tw`w-12 p-2 border border-gray-400 rounded-lg`}
          onPress={() => router.back()}
        >
          <Icon name="chevron-back" color={"#ffffff"} size={26} />
        </TouchableOpacity>

        {/* Greetings */}
        <View style={tw`mt-[30px] items-center`}>
          <Text
            style={{
              ...tw`text-[24px] font-medium`,
              color: "${PRIMARY_COLOR}",
            }}
          >
            <Icon name="mail" color={"#ffffff"} size={50} />
          </Text>
          <Text style={tw`text-gray-100 text-[15px] mt-[8px]`}>
            We have sent a code to ( {params?.email} ). Enter it here to
            verify your identity.
          </Text>
        </View>

        {/* Forms */}
        <View style={tw`mt-[32px] w-full items-center`}>
          <TextInput
            placeholder="Input verification code"
            value={code}
            onChangeText={(val) => {
              setCode(val);
            }}
            keyboardType="number-pad"
            style={tw`p-[16px] w-full rounded-2xl bg-white text-center border border-gray-200`}
          />
          <View
            style={tw`items-center justify-between flex flex-row mt-4 w-full`}
          >
            <Text style={tw`text-gray-100 font-medium text-[15px]`}>
              Haven't received email?{" "}
            </Text>
            <TouchableOpacity
              style={tw`justify-center items-center font-bold`}
              onPress={() => {
                alert("Code Resent.");
              }}
            >
              <Text style={tw`text-white font-bold text-[15px]`}>
                Send Email Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Buttons */}
        <View style={tw`mt-10 w-full flex flex-col items-center`}>
          <SecondaryBtn title={"Confirm >"} onpressed={handleLogin} />
        </View>
      </ScrollView>

      <View style={tw`w-full items-center justify-center flex flex-col`}>
        <LoadingModal
          visibility={modal}
          setVisibility={setModal}
          message={message}
          isloading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default VerificationScreen;
