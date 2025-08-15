import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { selectRates, selectUserProfile } from "@/hooks/redux/slice";
import { PRIMARY_COLOR } from "@/hooks/api/Index";
import Header from "@/components/Home/Header";
import { router } from "expo-router";
import Transactions from "@/components/Home/Transactions";
import LoadingModal from "@/components/common/Modals/LoadingModal";

const HomeScreen = () => {
  const [modal, setModal] = useState(true);
  const userProfile = useSelector(selectUserProfile);
  const rates = useSelector(selectRates);
  const [support] = React.useState("Hi Globees Ex, I'm interested in knowing more about the crypto section. Thank you");

  useEffect(() => {
    if (userProfile !== null) {
      setModal(false);
    } else {
      setModal(true);
    }
  });

  const handleCryptoPress = () => {
    if (Platform.OS === "ios") {
      Linking.openURL('whatsapp://send?text=' + support + '&phone=447778068566')
        .then(() => {
          console.log('WhatsApp Opened');
        })
        .catch(() => {
          alert('Make sure WhatsApp is installed on your device');
        });
    } else {
      router.push("/(tabs)/CryptoScreen");
    }
  };


  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="light" />
      
      {/* Header Section with Primary Color */}
      <View style={tw`bg-[${PRIMARY_COLOR}] pt-10 pb-6`}>
        <Header />
      </View>

      {/* Main Content */}
      <ScrollView 
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-6`}
      >
        <View style={tw`px-5 mt-2 mb-4`}>
          <Text style={tw`text-gray-700 font-bold text-base mb-2`}>
            Quick Actions
          </Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {/* Fiat Exchange Card */}
            <TouchableOpacity
              style={tw`w-[30%] bg-white rounded-xl shadow p-3 items-center mb-3 border border-gray-100`}
              activeOpacity={0.92}
              onPress={() => router.push("/(tabs)/ExchangeScreen")}
            >
              <View style={tw`bg-blue-100 w-10 h-10 rounded-lg items-center justify-center mb-1`}>
                <Icon name="contract-outline" size={20} style={tw`text-blue-700`} />
              </View>
              <Text style={tw`text-gray-900 font-semibold text-xs text-center mt-1`}>
                Fiat
              </Text>
              <Text style={tw`text-gray-400 text-[10px] text-center mt-0.5`}>
                FX
              </Text>
            </TouchableOpacity>

            {/* Crypto Exchange Card */}
            <TouchableOpacity
              style={tw`w-[30%] bg-white rounded-xl shadow p-3 items-center mb-3 border border-gray-100`}
              activeOpacity={0.92}
              onPress={handleCryptoPress}
            >
              <View style={tw`bg-green-100 w-10 h-10 rounded-lg items-center justify-center mb-1`}>
                <Icon name="cash-outline" size={20} style={tw`text-green-700`} />
              </View>
              <Text style={tw`text-gray-900 font-semibold text-xs text-center mt-1`}>
                Crypto
              </Text>
              <Text style={tw`text-gray-400 text-[10px] text-center mt-0.5`}>
                BTC
              </Text>
            </TouchableOpacity>

            {/* Payment Gateway Card */}
            <TouchableOpacity
              style={tw`w-[30%] bg-white rounded-xl shadow p-3 items-center mb-3 border border-gray-100`}
              activeOpacity={0.92}
              onPress={() => router.push("/(tabs)/PaymentScreen")}
            >
              <View style={tw`bg-purple-100 w-10 h-10 rounded-lg items-center justify-center mb-1`}>
                <Image
                  source={require("../../assets/images/payments.png")}
                  style={tw`w-5 h-5`}
                  resizeMode="contain"
                />
              </View>
              <Text style={tw`text-gray-900 font-semibold text-xs text-center mt-1`}>
                Payment
              </Text>
              <Text style={tw`text-gray-400 text-[10px] text-center mt-0.5`}>
                Pay
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Market Rates Section */}
        <View style={tw`px-5`}>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`bg-white rounded-xl p-4 border border-gray-200 flex-1 mr-2`}>
              <Text style={tw`text-gray-500 text-xs mb-1`}>
                {rates && rates.length > 0 ? rates[0]?.name : 'EUR/USD'}
              </Text>
              <Text style={tw`text-${PRIMARY_COLOR} font-bold text-lg`}>
                ₦{rates && rates.length > 0 ? rates[0]?.amount : '1.28'}
              </Text>
              <Text style={tw`text-green-600 text-xs`}>Best Rate</Text>
            </View>
            
            <View style={tw`bg-white rounded-xl p-4 border border-gray-200 flex-1 ml-2`}>
              <Text style={tw`text-gray-500 text-xs mb-1`}>
                {rates && rates.length > 1 ? rates[1]?.name : 'BTC/USD'}
              </Text>
              <Text style={tw`text-${PRIMARY_COLOR} font-bold text-lg`}>
                ₦{rates && rates.length > 1 ? rates[1]?.amount : '43,250'}
              </Text>
              <Text style={tw`text-green-600 text-xs`}>Second Best</Text>
            </View>
          </View>
        </View>

        {/* Transactions Section */}
        <View style={tw`w-full bg-transparent`}>
          <Transactions />
        </View>
      </ScrollView>

      {/* Loading Modal */}
      {modal && (
        <LoadingModal
          text={"Loading..."}
          visibility={modal}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
