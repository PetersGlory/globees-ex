import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Clipboard, Platform } from 'react-native'
import tw from 'twrnc'
import CustomHeader from '../Components/common/CustomHeader'
import { useState } from 'react'
import PrimaryBtn from '../Components/common/PrimaryBtn'
import Icon from "@expo/vector-icons/Ionicons"
import { Alert } from 'react-native'
import { useEffect } from 'react'

const AccountDetails = ({navigation, route}) => {
    const [country, setCountry] = useState("NG");
    const typeR = route.params.category;
    const currency_from = route.params.currency_from;
    const currency_to = route.params.currency_to;

    useEffect(()=>{
        if(currency_from == "NGN"){
            setCountry("NG");
        }else{
            setCountry("UK")
        }
    }, [])
    const copyToClipboard = async (text) => {
        try {
          await Clipboard.setString(text);
          alert('Account Number copied to clipboard!');
        } catch (error) {
          console.error('Copy to clipboard failed: ', error);
        }
      };
  return (
    <SafeAreaView style={tw`flex-grow p-5 pt-10`}>
        <StatusBar style='dark' />
        <View style={tw`w-full h-full ${Platform.OS == "ios" && "p-5 w-full h-full"}`}>
            <CustomHeader title={"Account Details"} />
            
            <Text style={tw`text-center text-gray-500 mt-5 text-[12px]`}>Please kindly make the payment to our bank account and send a confirmation here when done.</Text>

            <View style={tw`w-full mt-5`}>
                {/* Tabs */}
                <View style={tw`flex flex-row items-center justify-between`}>
                    {currency_from == "NGN" ? (
                        <TouchableOpacity style={tw`items-center flex-1 p-2 ${country == "NG" ? "border-b border-blue-800":""}`} onPress={()=>{
                            setCountry("NG")
                        }}>
                            <Text style={tw`text-gray-700 text-[15px]`}>🇳🇬 Nigeria</Text>
                        </TouchableOpacity>
                    ):<TouchableOpacity style={tw`items-center flex-1 p-2 ${country == "UK" ? "border-b border-blue-800":""}`} onPress={()=>{
                        setCountry("UK")
                    }}>
                        <Text style={tw`text-gray-700 text-[15px]`}>🇬🇧 United Kingdom</Text>
                    </TouchableOpacity>}
                    
                </View>

                {country == "NG" ? (
                    <View style={tw`bg-white rounded-lg p-5 mt-5`}>
                        <Text style={tw`text-[13px] text-gray-800 mt-2`}>Account Number: <Text style={tw`text-blue-800 font-medium`}>0499324419</Text>  <Icon name="md-copy-outline" onPress={()=> copyToClipboard("")} size={20} color={"#133A64"} /> </Text>
                        <Text style={tw`text-[13px] text-gray-800 mt-2`}>Bank Name: <Text style={tw`text-blue-800 font-medium`}>GT bank</Text>  <Icon name="md-copy-outline" onPress={()=> copyToClipboard("")} size={20} color={"#133A64"} /> </Text>
                        <Text style={tw`text-[13px] text-gray-800 mt-2`}>Account Name: <Text style={tw`text-blue-800 font-medium`}>Bamire Tolulope Stephen</Text>  <Icon name="md-copy-outline" onPress={()=> copyToClipboard("")} size={20} color={"#133A64"} /> </Text>

                        <View style={tw`mt-4`}>
                            <Text style={tw`text-[13px] text-gray-800 mt-2`}>NOTE: Reference as  <Text style={tw`text-blue-800 font-medium`}>Globees.ex</Text>  <Icon name="md-copy-outline" onPress={()=> copyToClipboard("")} size={20} color={"#133A64"} /> </Text>
                        </View>
                    </View>
                ) : (
                    <View style={tw`bg-white rounded-lg p-5 mt-5`}>
                        <Text style={tw`text-[13px] text-gray-800 mt-2`}>Account Number: <Text style={tw`text-blue-800 font-medium`}>62412362</Text>  <Icon name="md-copy-outline" onPress={()=> copyToClipboard("")} size={20} color={"#133A64"} /> </Text>
                        <Text style={tw`text-[13px] text-gray-800 mt-2`}>Sort Code: <Text style={tw`text-blue-800 font-medium`}>30-92-33</Text>  <Icon name="md-copy-outline" onPress={()=> copyToClipboard("")} size={20} color={"#133A64"} /> </Text>
                        <Text style={tw`text-[13px] text-gray-800 mt-2`}>Bank Name: <Text style={tw`text-blue-800 font-medium`}>Lloyds Bank</Text>  <Icon name="md-copy-outline" onPress={()=> copyToClipboard("")} size={20} color={"#133A64"} /> </Text>
                        <Text style={tw`text-[13px] text-gray-800 mt-2`}>Account Name: <Text style={tw`text-blue-800 font-medium`}>Bamire Tolulope</Text>  <Icon name="md-copy-outline" onPress={()=> copyToClipboard("")} size={20} color={"#133A64"} /> </Text>

                        <View style={tw`mt-4`}>
                            <Text style={tw`text-[13px] text-gray-800 mt-2`}>NOTE: Reference as  <Text style={tw`text-blue-800 font-medium`}>Globees.ex</Text>  <Icon name="md-copy-outline" onPress={()=> copyToClipboard("")} size={20} color={"#133A64"} /> </Text>
                        </View>
                    </View>
                )}

                <View style={tw`mt-5 w-full`}>
                    <PrimaryBtn onpressed={()=>{
                        navigation.navigate("SummaryScreen", {
                            category: typeR,
                            currency_from:currency_from,
                            currency_to:currency_to
                        })
                    }} title={"Continue"} />
                    {/* <Text style={tw`mt-3 text-[12px] text-gray-600`}>Note: Do not click paid if the payment has not been sent from your bank. Ensure to send the exact amount required to process your payment instantly.</Text> */}
                </View>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default AccountDetails