import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import Icon from "@expo/vector-icons/Ionicons"
import { Linking } from 'react-native'

const CustomSocial = ({visibility, setVisibility}:any) => {
  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={visibility}
    onRequestClose={() => {
        setVisibility(false);
    }}
    >
        <View style={tw`w-full h-full bg-gray-100 pt-5`}>
            <TouchableOpacity style={tw`absolute top-5 right-5 z-10`} onPress={()=> setVisibility(false)}>
                <Icon name='close-circle-outline' size={26} />
            </TouchableOpacity>
            <Text style={tw`text-center text-gray-600 font-medium text-[18px] mt-2 text-blue-800`}>Social Media</Text>

            <View style={tw`mt-2 w-full p-2 flex flex-col h-[95%] items-center justify-center`}>
                <Text style={tw`mt-2 text-gray-800 text-center text-[20px]`}>Get in Touch with Us</Text>
                <View style={tw`mt-5 flex flex-row items-center justify-between w-[70%]`}>
                    <TouchableOpacity style={tw`rounded-full p-2 bg-white`} onPress={()=>{
                        Linking.openURL("https://facebook.com/globees_ex");
                    }}>
                        <Icon name="logo-facebook" size={26} style={tw`text-center p-2 text-blue-800`} />
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`rounded-full p-2 bg-white`} onPress={()=>{
                        Linking.openURL("https://twitter.com/globees_ex");
                    }}>
                        <Icon name="logo-twitter" size={26} style={tw`text-center p-2 text-blue-500`} />
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`rounded-full p-2 bg-white`} onPress={()=>{
                        Linking.openURL("https://www.instagram.com/globees.ex/");
                    }}>
                        <Icon name="logo-instagram" size={26} style={tw`text-center p-2 text-red-800`} />
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`rounded-full p-2 bg-white`} onPress={()=>{
                        Linking.openURL("https://t.me/globees_ex");
                    }}>
                        <Icon name="paper-plane" size={26} style={tw`text-center p-2 text-blue-700`} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default CustomSocial