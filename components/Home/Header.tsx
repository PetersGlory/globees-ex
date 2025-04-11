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

interface UserProfile {
  fullname: string;
  email: string;
}

const Header = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userProfile = useSelector(selectUserProfile) as UserProfile;
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        getProfile(accessToken),
        getRates()
      ]);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfile = async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.data;
      dispatch(setUserProfile(userData));
      await updatedevicetoken(userData.email, token);
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  };

  const getRates = async () => {
    try {
      const response = await axios.get(`${GENERAL_URL}/rates`);
      dispatch(setRates(response.data.message));
    } catch (error) {
      console.error("Error fetching rates:", error);
      throw error;
    }
  };

  return (
    <View style={tw`w-full flex flex-row items-center justify-between px-3 py-2`}>
      <StatusBar style="light" />
      
      {/* Left Section - Welcome Message */}
      <TouchableOpacity
        style={tw`flex-1 flex flex-row items-center`}
        onPress={() => router.push("/MoreScreen")}
      >
        <View>
          <Text style={tw`text-white text-xs`}>Welcome back!</Text>
          <Text style={tw`text-white font-medium text-lg`}>
            {userProfile?.fullname || "User"}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleRefresh}
          style={tw`ml-4`}
        >
          <Icon
            name="reload-outline"
            color="#ffffff"
            size={20}
            style={tw`p-2`}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Right Section - Rewards and Notifications */}
      <View style={tw`flex flex-row gap-2 items-center`}>
        <TouchableOpacity
          style={tw`flex-row items-center gap-2 px-3 py-2 border border-white rounded-2xl`}
          onPress={() => router.push("/RewardsScreen")}
        >
          <Icon
            name="gift-outline"
            color="#ffffff"
            size={16}
          />
          <Text style={tw`text-white font-bold text-xs`}>Get 15.0 GBP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push("/NotificationScreen")}
        >
          <Icon
            name="notifications-outline"
            color="#ffffff"
            size={18}
            style={tw`p-2 border border-white rounded-2xl`}
          />
        </TouchableOpacity>
      </View>

      <LoadingModal 
        visibility={isLoading}
        text="Loading..."
      />
    </View>
  );
};

export default Header;
