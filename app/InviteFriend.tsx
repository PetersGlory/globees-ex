import { Ionicons } from "@expo/vector-icons";
import CustomLegal from "@/components/common/Modals/CustomLegal";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Clipboard,
  ScrollView,
  Share,
} from "react-native";
import tw from "twrnc";
import { PRIMARY_COLOR } from "@/hooks/api/Index";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { selectUserProfile } from "@/hooks/redux/slice";

const InviteFriendsScreen = () => {
  const [modal, setModal] = useState(false);
  const userAcc = useSelector(selectUserProfile);
  const referralCode = userAcc?.user_id || "";

  const copyToClipboard = () => {
    Clipboard.setString(referralCode);
    alert("Referral code copied to clipboard");
    // You could add a toast notification here
  };

  const handleShare = async () => {
    try {
      const result = await Share.share(
        {
          message: `Hey! I'm using Globees Ex to send money. Join me and get £10 when you send upto £100 in one transaction. Plus £5 when you complete KYC verification, download and use my referral code '${referralCode}' to sign up`,
          title: "Globees Ex",
          url: referralCode, // iOS only
        },
        {
          dialogTitle: "Globees Ex", // Android only
        }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log(result);
        } else {
          // shared
          console.log(result);
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error:any) {
      alert(error?.message);
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={tw`flex-1 py-6 bg-[${PRIMARY_COLOR}]`}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={tw`p-4 flex-row items-center`}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`w-10 h-10 bg-white rounded-full items-center justify-center`}
        >
          <Ionicons name="close-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl text-center font-semibold ml-4`}>
          Invite friends
        </Text>
      </View>

      {/* Main Content */}
      <View style={tw`flex-1 items-center px-4`}>
        {/* Illustration */}
        <View style={tw`w-[85%] h-[43%] my-4`}>
          <Image
            source={require("../assets/images/rewards.png")}
            style={tw`w-full h-full`}
            resizeMode="stretch"
          />
        </View>

        {/* Reward Text */}
        <Text style={tw`text-white text-xl font-bold text-center mb-2`}>
          Earn £50 if you exchange upto £500 a week
        </Text>

        <Text style={tw`text-white text-center text-sm mb-4`}>
          Invite a friend and you get £10 each when they send upto £100 in one
          transaction. Plus £5 to your friend When they complete Know Your Customer (KYC) verification process.
        </Text>

        {/* Referral Code Section */}
        <View
          style={tw`w-full bg-[#464679] rounded-xl px-4 py-2.5 flex-row justify-between items-center mb-4`}
        >
          <View>
            <Text style={tw`text-white/60 text-sm mb-1`}>
              Your referral code
            </Text>
            <Text style={tw`text-white text-xl font-semibold uppercase`}>
              {referralCode}
            </Text>
          </View>
          <TouchableOpacity
            onPress={copyToClipboard}
            style={tw`bg-white/20 px-4 py-2 rounded-full`}
          >
            <Text style={tw`text-white font-medium`}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* Invite Button */}
        <TouchableOpacity
        onPress={handleShare}
          style={tw`w-full bg-[#10B981] rounded-lg px-4 py-2.5 flex-row items-center justify-between mb-4`}
        >
          <View style={tw`flex-row items-center`}>
            {/* Small cartoon icon would go here */}
            <Text style={tw`text-white text-xl font-semibold ml-2`}>
              Invite friends
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Terms and Conditions */}
        <TouchableOpacity onPress={() => setModal(true)}>
          <Text style={tw`text-white/80 text-sm underline`}>
            Terms and conditions apply
          </Text>
        </TouchableOpacity>
      </View>
      <CustomLegal isRefer={true} visibility={modal} setVisibility={setModal} />
    </SafeAreaView>
  );
};

export default InviteFriendsScreen;
