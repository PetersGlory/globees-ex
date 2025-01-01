import { Ionicons } from '@expo/vector-icons';
import CustomLegal from '@/components/common/Modals/CustomLegal';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Clipboard } from 'react-native';
import tw from 'twrnc';
import { PRIMARY_COLOR } from '@/hooks/api/Index';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const InviteFriendsScreen = () => {
    const [modal, setModal] = useState(false);
  const referralCode = 'TOLUJ8H8';

  const copyToClipboard = () => {
    Clipboard.setString(referralCode);
    // You could add a toast notification here
  };

  return (
    <SafeAreaView style={tw`flex-1 py-6 bg-[${PRIMARY_COLOR}]`}>
        <StatusBar style="light" />
      {/* Header */}
      <View style={tw`p-4 flex-row items-center`}>
        <TouchableOpacity 
        onPress={()=> router.back()}
          style={tw`w-10 h-10 bg-white rounded-full items-center justify-center`}
        >
          <Ionicons name="close-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl text-center font-semibold ml-4`}>Invite friends</Text>
      </View>

      {/* Main Content */}
      <View style={tw`flex-1 items-center px-4`}>
        {/* Illustration */}
        <View style={tw`w-full h-[30%] my-4`}>
          <Image
            source={require("../assets/images/refer.png")}
            style={tw`w-full h-full`}
            resizeMode="contain"
          />
        </View>

        {/* Reward Text */}
        <Text style={tw`text-white text-xl font-bold text-center mb-2`}>
          Earn £50 if you exchange upto £500 a week
        </Text>
        
        <Text style={tw`text-white text-center text-sm mb-4`}>
          Invite a friend and you both get £10.0 each when they send over £100.0 to supported countries in one single transaction.Plus Additional £5 to the friend when the friend completes verification and signup
        </Text>

        {/* Referral Code Section */}
        <View style={tw`w-full bg-[#464679] rounded-xl p-4 flex-row justify-between items-center mb-4`}>
          <View>
            <Text style={tw`text-white/60 text-sm mb-1`}>Your referral code</Text>
            <Text style={tw`text-white text-xl font-semibold`}>{referralCode}</Text>
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
          style={tw`w-full bg-[#10B981] rounded-xl p-4 flex-row items-center justify-between mb-4`}
        >
          <View style={tw`flex-row items-center`}>
            {/* Small cartoon icon would go here */}
            <Text style={tw`text-white text-xl font-semibold ml-2`}>Invite friends</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Terms and Conditions */}
        <TouchableOpacity onPress={()=> setModal(true)}>
          <Text style={tw`text-white/80 text-sm underline`}>
            *Terms and conditions apply
          </Text>
        </TouchableOpacity>
      </View>      
      <CustomLegal visibility={modal} setVisibility={setModal} />
    </SafeAreaView>
  );
};

export default InviteFriendsScreen;

