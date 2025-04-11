import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Share,
  Alert,
  Platform,
  ScrollView,
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import CustomLegal from "@/components/common/Modals/CustomLegal";
import { PRIMARY_COLOR } from "@/hooks/api/Index";
import { selectUserProfile } from "@/hooks/redux/slice";

interface UserProfile {
  user_id: string;
  fullname?: string;
}

const InviteFriendsScreen = () => {
  const [isLegalModalVisible, setLegalModalVisible] = useState(false);
  const userProfile = useSelector(selectUserProfile) as UserProfile;
  const referralCode = userProfile?.user_id || "";

  const copyToClipboard = () => {
    Clipboard.setString(referralCode);
    Alert.alert(
      "Success",
      "Referral code copied to clipboard",
      [{ text: "OK" }],
      { cancelable: true }
    );
  };

  const handleShare = async () => {
    try {
      const shareMessage = `Hey! I'm using Globees Ex to send money. Join me and get £10 when you send up to £100 in one transaction. Plus £5 when you complete KYC verification. Download and use my referral code '${referralCode}' to sign up!`;
      
      const result = await Share.share(
        {
          message: shareMessage,
          title: "Globees Ex",
          url: referralCode, // iOS only
        },
        {
          dialogTitle: "Invite Friends to Globees Ex", // Android only
          subject: "Join me on Globees Ex", // iOS only
        }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert(
        "Error",
        "Failed to share referral code. Please try again.",
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 pt-5 bg-[${PRIMARY_COLOR}]`}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={tw`p-4 flex-row items-center justify-between`}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`w-10 h-10 bg-white/20 rounded-full items-center justify-center`}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl font-semibold`}>
          Invite Friends
        </Text>
        <View style={tw`w-10`} /> {/* Spacer for alignment */}
      </View>

      {/* Main Content */}
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`items-center px-4 pb-8`}>
        {/* Illustration */}
        <View style={tw`w-[85%] h-[200px] my-6`}>
          <Image
            source={require("../assets/images/rewards.png")}
            style={tw`w-full h-full`}
            resizeMode="contain"
          />
        </View>

        {/* Reward Text */}
        <View style={tw`items-center mb-6`}>
          <Text style={tw`text-white text-2xl font-bold text-center mb-3`}>
            Earn £50 Weekly Bonus
          </Text>
          <Text style={tw`text-white/90 text-center text-base leading-6`}>
            Invite a friend and you both get £10 when they send up to £100 in one transaction. 
            Plus £5 bonus when they complete KYC verification.
          </Text>
        </View>

        {/* Referral Code Section */}
        <View style={tw`w-full bg-white/10 rounded-xl p-4 mb-6`}>
          <Text style={tw`text-white/60 text-sm mb-2`}>
            Your referral code
          </Text>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-white text-2xl font-bold tracking-wider`}>
              {referralCode}
            </Text>
            <TouchableOpacity
              onPress={copyToClipboard}
              style={tw`bg-white/20 px-4 py-2 rounded-full flex-row items-center`}
            >
              <Ionicons name="copy-outline" size={16} color="#fff" style={tw`mr-1`} />
              <Text style={tw`text-white font-medium`}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite Button */}
        <TouchableOpacity
          onPress={handleShare}
          style={tw`w-full bg-[#10B981] rounded-xl p-4 mb-6 flex-row items-center justify-between`}
        >
          <View style={tw`flex-row items-center`}>
            <Ionicons name="share-social-outline" size={24} color="#fff" style={tw`mr-3`} />
            <Text style={tw`text-white text-lg font-semibold`}>
              Invite Friends
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Terms and Conditions */}
        <TouchableOpacity 
          onPress={() => setLegalModalVisible(true)}
          style={tw`flex-row items-center`}
        >
          <Ionicons name="document-text-outline" size={16} color="#fff" style={tw`mr-1`} />
          <Text style={tw`text-white/80 text-sm underline`}>
            Terms and conditions apply
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomLegal 
        isRefer={true} 
        visibility={isLegalModalVisible} 
        setVisibility={setLegalModalVisible} 
      />
    </SafeAreaView>
  );
};

export default InviteFriendsScreen;
