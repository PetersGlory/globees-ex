import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import Icon from "@expo/vector-icons/Ionicons"
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'

const CustomHeader = ({title}:any) => {
  return (
    <View style={tw`w-full flex flex-row items-center justify-between mt-5`}>      
      <StatusBar style="dark" />
      <TouchableOpacity style={tw`rounded-lg p-2 items-center border border-blue-800`} onPress={()=> router.back()}>
        <Icon name="chevron-back-outline" style={tw`text-center`} size={20} />
      </TouchableOpacity>
      <Text style={tw`text-center font-medium text-[15px]`}>{title}</Text>
      <TouchableOpacity style={tw`rounded-lg p-2 items-center border border-blue-800`} onPress={()=> router.push("/NotificationScreen")}>
          <Icon name="notifications-outline" style={tw`text-center`} size={20} />
        </TouchableOpacity>
    </View>
  )
}

export default CustomHeader