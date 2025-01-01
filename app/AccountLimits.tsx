import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Clipboard,
} from "react-native";
import tw from "twrnc";
import { useState } from "react";
import Icon from "@expo/vector-icons/Ionicons";
import { Platform } from "react-native";
import CustomHeader from "@/components/common/CustomHeader";

const AccountLimits = () => {
  const [country, setCountry] = useState("NG");
  const copyToClipboard = async (text: any) => {
    try {
      await Clipboard.setString(text);
      alert("Account Number copied to clipboard!");
    } catch (error) {
      console.error("Copy to clipboard failed: ", error);
    }
  };
  return (
    <SafeAreaView style={tw`flex-grow bg-white p-5 pt-10`}>
      <StatusBar style="dark" />
      <View
        style={tw`w-full h-full ${
          Platform.OS == "ios" ? "p-5 w-full h-full" : ""
        }`}
      >
        <CustomHeader title={"Account Limits"} />

        <Text style={tw`text-center text-gray-500 mt-5 text-[12px]`}>
          The limit shows how much you can send with your Globees Ex Account.
        </Text>

        <View style={tw`w-full mt-5`}>
          {/* Tabs */}
          <View style={tw`flex flex-row items-center justify-between`}>
            <TouchableOpacity
              style={tw`items-center flex-1 p-2 ${
                country == "NG" ? "border-b border-blue-800" : ""
              }`}
              onPress={() => {
                setCountry("NG");
              }}
            >
              <Text style={tw`text-gray-700 text-[15px]`}>
                🇳🇬 NGN (Naira) Limit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`items-center flex-1 p-2 ${
                country == "UK" ? "border-b border-blue-800" : ""
              }`}
              onPress={() => {
                setCountry("UK");
              }}
            >
              <Text style={tw`text-gray-700 text-[15px]`}>
                🇬🇧 GBP (Pounds) Limit
              </Text>
            </TouchableOpacity>
          </View>

          {country == "NG" ? (
            <View style={tw`bg-white rounded-lg p-5 mt-5`}>
              <Text style={tw`text-[15px] text-gray-800 mt-2`}>
                Daily Transaction:{" "}
                <Text style={tw`text-blue-800 font-bold`}>NGN5,000,000</Text>{" "}
              </Text>
              <Text style={tw`text-[15px] text-gray-800 mt-2`}>
                Weekly Transaction:{" "}
                <Text style={tw`text-blue-800 font-bold`}>NGN15,000,000</Text>{" "}
              </Text>
              <Text style={tw`text-[15px] text-gray-800 mt-2`}>
                Monthly Transaction:{" "}
                <Text style={tw`text-blue-800 font-bold`}>NGN50,000,000</Text>{" "}
              </Text>

              <View style={tw`mt-4`}>
                <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                  Deposit Per Transaction is{" "}
                  <Text style={tw`text-blue-800 font-bold`}>NGN5,000,000.</Text>{" "}
                </Text>
              </View>
            </View>
          ) : (
            <View style={tw`bg-white rounded-lg p-5 mt-5`}>
              <Text style={tw`text-[15px] text-gray-800 mt-2`}>
                Daily Transaction:{" "}
                <Text style={tw`text-blue-800 font-bold`}>5,000.00 GBP</Text>{" "}
              </Text>
              {/* <Text style={tw`text-[15px] text-gray-800 mt-2`}>Sort Code Transaction: <Text style={tw`text-blue-800 font-bold`}>30-92-33</Text> </Text> */}
              <Text style={tw`text-[15px] text-gray-800 mt-2`}>
                Weekly Transaction:{" "}
                <Text style={tw`text-blue-800 font-bold`}>15,000.00 GBP</Text>{" "}
              </Text>
              <Text style={tw`text-[15px] text-gray-800 mt-2`}>
                Monthly Transaction:{" "}
                <Text style={tw`text-blue-800 font-bold`}>30,000.00 GBP</Text>{" "}
              </Text>

              <View style={tw`mt-4`}>
                <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                  Deposit Per Transaction is{" "}
                  <Text style={tw`text-blue-800 font-bold`}>5,000.00 GBP</Text>{" "}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountLimits;
