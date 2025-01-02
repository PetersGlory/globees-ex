import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import Icon from "@expo/vector-icons/Ionicons"
import { WebView } from 'react-native-webview';

const CustomLegal = ({visibility, setVisibility, isRefer}:any) => {
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
            <Text style={tw`text-center text-gray-600 font-semibold text-[18px] mt-2 text-blue-800 capitalize`}>{isRefer ? "GLOBEES EX Referral terms" : "GLOBEES EX LEGAL"}</Text>

            <View style={tw`mt-2 w-full p-2 flex h-[95%] flex-col rounded-t-3xl`}>
                <WebView
                    source={{ uri: isRefer ? 'https://www.globees.co.uk/referralprogramterms' :'https://www.globees.co.uk/terms-and-conditions' }}
                />
            </View>
        </View>
    </Modal>
  )
}

export default CustomLegal