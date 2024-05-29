import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { View, Text, SafeAreaView, Alert } from 'react-native'
import tw from "twrnc"
import CustomHeader from '../Components/common/CustomHeader'
import PrimaryBtn from '../Components/common/PrimaryBtn'
import { useDispatch, useSelector } from 'react-redux'
import { selectAccessToken, selectExchange, selectRates, selectReceiver, selectUserProfile, setCryptoData } from '../config/redux/slice'
import { BASE_URL, NumberFormatter, primePercent, sendpush } from '../config/api/Index'
import axios from 'axios'
import LoadingModal from '../Components/common/Modals/LoadingModal'
import { useState } from 'react'
import { Platform } from 'react-native'
import { ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { usePushNotification } from '../../usePushNotification'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SummaryScreen = ({navigation,route}) => {
    const [modal, setModal] = useState(false);
    const navigator = useNavigation();
    const dispatch = useDispatch();
    const exchangeed = useSelector(selectExchange);
    const typeR = route.params.category;
    const currency_from = route.params.currency_from;
    const currency_to = route.params.currency_to;
    const accountD = useSelector(selectReceiver);
    const key = useSelector(selectAccessToken);
    const usersP = useSelector(selectUserProfile)
    const rates = useSelector(selectRates)

    const {expoPushToken} = usePushNotification();
    let amounted = exchangeed?.from.substring(1);
    let rated = rates.find(rate => rate.name === "Usd")

    useEffect(()=>{
        setPush();
    },[])
    
    const amountfrom = typeR == "exchange" ? exchangeed?.from : typeR == "crypto" ? eval((Number(exchangeed?.from) * (rated.amount - 200)) - primePercent(parseInt(exchangeed?.from))) : exchangeed?.from[0] + NumberFormatter(eval(Number(exchangeed?.from.substring(1)) + Number(primePercent(amounted).toFixed(2))))
    
    const setPush = async () =>{
    //   console.log(expoPushToken?.data)
      await AsyncStorage.setItem("pushToken", expoPushToken?.data);
    }

    let transactionsData = {
        amountsend: `${exchangeed?.to} ${currency_from}`, 
        amountreceive: amountfrom, 
        service_charge: "0", 
        category: typeR, 
        receiver_name: accountD?.account_name, 
        bank_name: accountD?.bank_name, 
        account_number: accountD?.account_number, 
        sort_code: accountD?.sort_code, 
        payment_reason : accountD?.payment_reason, 
        studentId: accountD?.student_id, 
        iban: accountD?.iban, 
        swift_bic: accountD?.swift_bic
    }

    const handleContinue = () =>{
        if(typeR == "crypto"){
            dispatch(setCryptoData(transactionsData));
            navigation.navigate("CryptoSuccess", {
                category: typeR,
                currency_from:currency_from,
                currency_to:currency_to
            })
        }else{
            navigation.navigate("AccountDetails", {
                category: typeR,
                currency_from:currency_from,
                currency_to:currency_to
            })
        }
    }
    
  return (
    <SafeAreaView style={tw`flex-grow w-full h-full p-5`}>
        <StatusBar style='dark' />
        <ScrollView style={tw`w-full h-full ${Platform.OS == "ios" && "p-5 w-full h-full"}`}>
            <CustomHeader title={"Summary Details"} />

            <Text style={tw`text-center text-gray-500 mt-5 text-[12px]`}>
               kindly go through the {typeR} information and proceed to click.
            </Text>

            <View style={tw`bg-white rounded-lg p-5 mt-5`}>
                <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                    <Text style={tw`text-gray-400`}>Category Type: </Text>
                    <Text style={tw`text-gray-800 capitalize`}>{typeR}</Text>
                </View>
                <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                    <Text style={tw`text-gray-400`}>Send: </Text>
                    {typeR == "crypto" ? (
                        <Text style={tw`text-gray-800`}>{exchangeed?.to} {currency_from}</Text>
                    ) : (
                        <Text style={tw`text-gray-800`}>{amountfrom}.00</Text>)}
                </View>
                <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                    <Text style={tw`text-gray-400`}>Receive: </Text>
                    {typeR == "crypto" ? (
                        <Text style={tw`text-gray-800`}>NGN{NumberFormatter(parseInt(amountfrom))}.00</Text>
                    ) : (
                        <Text style={tw`text-gray-800`}>{exchangeed?.to} </Text>)}
                    
                </View>
                {/* {typeR !== "exchange" && (
                    <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                        <Text style={tw`text-gray-400`}>Service Charge: </Text>
                        <Text style={tw`text-gray-800`}>{exchangeed.from[0] + primePercent(Number(amounted)).toFixed(2)}</Text>
                    </View>
                )} */}
                <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                    <Text style={tw`text-gray-400`}>Recipient Name: </Text>
                    <Text style={tw`text-gray-800`}>{accountD?.account_name}</Text>
                </View>
                <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                    <Text style={tw`text-gray-400`}>Bank Name: </Text>
                    <Text style={tw`text-gray-800`}>{accountD?.bank_name}</Text>
                </View>
                <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                    <Text style={tw`text-gray-400`}>Account Number: </Text>
                    <Text style={tw`text-gray-800`}>{accountD?.account_number}</Text>
                </View>
                <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                    <Text style={tw`text-gray-400`}>Sort Code: </Text>
                    <Text style={tw`text-gray-800`}>{accountD?.sort_code !== "" ? accountD?.sort_code : "N/A"}</Text>
                </View>

                {typeR !== "exchange" || typeR !== "crypto" && (
                    <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                        <Text style={tw`text-gray-400`}>Payment Reason: </Text>
                        <Text style={tw`text-gray-800`}>{accountD?.payment_reason}</Text>
                    </View>
                )}

                {typeR !== "exchange" && currency_to !== "UK" && currency_from !== "NGN" && typeR !=='crypto' && (
                    <View style={tw`w-full`}>
                        <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                            <Text style={tw`text-gray-400`}>Iban: </Text>
                            <Text style={tw`text-gray-800`}>{accountD?.iban}</Text>
                        </View>
                        <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                            <Text style={tw`text-gray-400`}>Swift Bic: </Text>
                            <Text style={tw`text-gray-800`}>{accountD?.swift_bic}</Text>
                        </View>
                        <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                            <Text style={tw`text-gray-400`}>Address: </Text>
                            <Text style={tw`text-gray-800`}>{accountD?.address}</Text>
                        </View>
                    </View>
                )}

                {accountD?.student_id !== "" && (
                    <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                        <Text style={tw`text-gray-400`}>Student ID: </Text>
                        <Text style={tw`text-gray-800`}>{accountD?.student_id}</Text>
                    </View>
                )}
            </View>

            <View style={tw`mt-5 w-full`}>
                <PrimaryBtn onpressed={handleContinue} title={"Continue"} />
                {/* <Text style={tw`mt-3 text-[12px] text-gray-600`}>Note: Do not click paid if the payment has not been sent from your bank. Ensure to send the exact amount required to process your payment instantly.</Text> */}
            </View>
        </ScrollView>
      <LoadingModal message={"Loading..."} isloading={true} visibility={modal} setVisibility={setModal} />
    </SafeAreaView>
  )
}

export default SummaryScreen