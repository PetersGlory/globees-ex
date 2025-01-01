import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import {
  selectAccessToken,
  selectUserProfile,
  setRates,
  setUserProfile,
} from "@/hooks/redux/slice";
import { BASE_URL, GENERAL_URL, updatedevicetoken } from "@/hooks/api/Index";
import LoadingModal from "../common/Modals/LoadingModal";
import { router } from "expo-router";

const Header = () => {
  const [modal, setModal] = useState(false);
  const userProfile = useSelector(selectUserProfile);
  const dispatch = useDispatch();
  const key = useSelector(selectAccessToken);

  const handleRefresh = () => {
    setModal(true);
    getProfile(key);
    getRates();
    setTimeout(() => {
      setModal(false);
      router.replace("/(tabs)");
    });
  };

  // Getting Profile
  const getProfile = (key: any) => {
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
        updatedevicetoken(dataUser.email, key);
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
  return (
    <View style={tw`w-full flex flex-row items-center justify-between px-3 py-2`}>
      <StatusBar style="light" />
      <TouchableOpacity
        style={tw`flex-1 flex flex-row`}
        onPress={() => router.push("/MoreScreen")}
      >
        <View>
          <Text style={tw`text-white text-[12px]`}>Welcome back!</Text>
          <Text style={tw`text-white font-medium text-[18px]`}>
            {userProfile?.fullname}
          </Text>
        </View>
        <TouchableOpacity onPress={handleRefresh}>
          <Icon
            name="reload-outline"
            color={"#ffffff"}
            size={20}
            style={tw`text-center p-2 ml-4`}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={tw`w-auto flex flex-row gap-2 items-center justify-end flex-1`}>
        <TouchableOpacity
          style={tw`w-auto items-center flex-row gap-2 px-2 border rounded-2xl text-center py-2 border-white`}
          onPress={() => router.push("/RewardsScreen")}
        >
          <Icon
            name="gift-outline"
            color={"#ffffff"}
            size={16}
            style={tw`w-auto`}
          />
          <Text style={tw`text-white font-bold text-[10px]`}>Get 15.0 EUR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw``}
          onPress={() => router.push("/NotificationScreen")}
        >
          <Icon
            name="notifications-outline"
            color={"#ffffff"}
            size={18}
            style={tw`border rounded-2xl text-center p-2 border-white w-auto`}
          />
        </TouchableOpacity>
      </View>

      {modal && (
        <View
          style={tw`w-full flex flex-col h-full absolute top-0 bottom-0 items-center justify-center bg-transparent`}
        >
          <LoadingModal
            message={"Loading..."}
            isloading={true}
            visibility={modal}
            setVisibility={setModal}
          />
        </View>
      )}
    </View>
  );
};

export default Header;
