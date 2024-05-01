import React from 'react'
import { StackActions, useNavigation } from '@react-navigation/native'
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import Icon from "@expo/vector-icons/Ionicons"
import { Platform } from 'react-native'
import PrimaryBtn from '../PrimaryBtn'
import { useSelector } from 'react-redux'
import { selectExchange } from '../../../config/redux/slice'

const SuccessTransaction = ({route}) => {
    const navigator = useNavigation()
    const exchangeed = useSelector(selectExchange);
    const typeR = route.params.category;
  return (
    <SafeAreaView style={tw`flex flex-grow h-full w-full bg-white`}>
        <View style={tw`w-full h-full items-center justify-center p-5 ${Platform.OS == "ios" && "p-5 w-full h-full"}`}>
        <TouchableOpacity style={tw`absolute top-10 right-5`} onPress={()=> navigator.dispatch(StackActions.replace("HomeScreen"))}>
            <Icon name='close-circle-outline' color={"#133A64"} size={30} />
        </TouchableOpacity>

            <Image source={require('../../../../assets/img/success-bg.png')} style={{
                width: 200,
                height:200
            }} alt={'completed'} />

            <Text style={tw`text-center font-medium text-gray-700 text-[15px]`}>Transfer in progress</Text>
            <Text style={tw`text-center font-bold text-blue-700 text-xl mt-2`}>{exchangeed?.to}</Text>
            {typeR !== "exchange" ? (
                <Text style={tw`text-center text-gray-500 mt-5 text-[14px]`}>
                    Your payment will be processed in minutes...
                </Text>
            ) :(
                <Text style={tw`text-center text-gray-500 mt-5 text-[14px]`}>
                    Your exchange will arrive in minutes. Thank you for your business with Globees Ex! We look forward to 
                    connecting with you again.
                </Text>
            )}
            
            <View style={tw`items-center w-full mt-5`}>
                <PrimaryBtn title={"Home"} onpressed={()=> navigator.dispatch(StackActions.replace("HomeScreen"))} />
            </View>
        </View>
    </SafeAreaView>
  )
}

export default SuccessTransaction