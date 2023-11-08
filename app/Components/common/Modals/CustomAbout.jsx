import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import Icon from "@expo/vector-icons/Ionicons"
import { useDispatch } from 'react-redux'
import { WebView } from 'react-native-webview';

const CustomAbout = ({visibility, setVisibility}) => {
    const dispatch = useDispatch();
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
                <Icon name='md-close-circle-outline' size={26} />
            </TouchableOpacity>
            <Text style={tw`text-center text-gray-600 font-medium text-[18px] mt-2 text-blue-800`}>ABOUT GLOBEES EX</Text>

            <View style={tw`mt-2 w-full p-2 flex flex-col h-[95%]`}>
                <WebView
                    // style={tw`p-1 w-full h-full`}
                    source={{ uri: 'https://www.globees.co.uk/company-profile' }}
                    onMessage={(event) => {
                        alert("Taxig Legal Loading...");
                    }}
                />
            </View>
        </View>
    </Modal>
  )
}

export default CustomAbout