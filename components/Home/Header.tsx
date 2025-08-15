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
    <View style={tw`px-5`}>
      <StatusBar style="light" />
      
      {/* Welcome Section */}
      <View style={tw`flex-row items-center justify-between mb-6`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-blue-100 text-sm font-medium mb-1`}>
            Welcome back!
          </Text>
          <Text style={tw`text-white font-bold text-2xl`}>
            {userProfile?.fullname || "User"}
          </Text>
        </View>
        
        <View style={tw`flex-row items-center gap-3`}>
          <TouchableOpacity 
            onPress={handleRefresh}
            style={tw`bg-white/20 p-2 rounded-xl`}
          >
            <Icon
              name="reload-outline"
              color="#ffffff"
              size={20}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => router.push("/NotificationScreen")}
            style={tw`bg-white/20 p-2 rounded-xl`}
          >
            <Icon
              name="notifications-outline"
              color="#ffffff"
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rewards Banner */}
      <TouchableOpacity
        style={tw`bg-white/10 border border-white/20 rounded-2xl p-4 flex-row items-center justify-between`}
        onPress={() => router.push("/RewardsScreen")}
        activeOpacity={0.8}
      >
        <View style={tw`flex-row items-center`}>
          <View style={tw`bg-yellow-400 w-10 h-10 rounded-xl items-center justify-center mr-3`}>
            <Icon
              name="gift"
              color="#1f2937"
              size={20}
            />
          </View>
          <View>
            <Text style={tw`text-white font-bold text-base`}>
              Get £15.0 Bonus
            </Text>
            <Text style={tw`text-blue-100 text-sm`}>
              Complete your first transaction
            </Text>
          </View>
        </View>
        <Icon
          name="chevron-forward"
          color="#ffffff"
          size={20}
        />
      </TouchableOpacity>

      <LoadingModal 
        visibility={isLoading}
        text="Loading..."
      />
    </View>
  );
};

export default Header;
