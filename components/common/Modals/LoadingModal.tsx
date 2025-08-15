import React from 'react'
import { View, Text, Modal, ActivityIndicator } from 'react-native'
import tw from "twrnc"
import { PRIMARY_COLOR } from '@/hooks/api/Index'

interface LoadingModalProps {
  visibility: boolean;
  text?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ visibility, text = "Please wait..." }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visibility}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/50`}>
        <View style={tw`bg-white rounded-2xl p-6 shadow-xl min-w-[200px] items-center`}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={tw`mb-4`} />
          <Text style={tw`text-gray-700 text-base text-center font-medium`}>
            {text}
          </Text>
        </View>
      </View>
    </Modal>
  )
}

export default LoadingModal