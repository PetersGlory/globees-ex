import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import Icon from "@expo/vector-icons/Ionicons"

const CustomHeader = ({title}) => {
    const navigator = useNavigation()
  return (
    <View style={tw`w-full flex flex-row items-center justify-between mt-5`}>
      <TouchableOpacity style={tw`rounded-lg p-2 items-center border border-blue-800`} onPress={()=> navigator.goBack()}>
        <Icon name="chevron-back-outline" style={tw`text-center`} size={20} />
      </TouchableOpacity>
      <Text style={tw`text-center font-medium text-[15px]`}>{title}</Text>
      <TouchableOpacity style={tw`rounded-lg p-2 items-center border border-blue-800`} onPress={()=> navigator.push("NotificationScreen")}>
          <Icon name="notifications-outline" style={tw`text-center`} size={20} />
        </TouchableOpacity>
    </View>
  )
}

export default CustomHeader