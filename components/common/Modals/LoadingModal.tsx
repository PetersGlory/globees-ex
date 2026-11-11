import React from 'react'
import { View, Text, Modal, ActivityIndicator } from 'react-native'
import tw from "twrnc"
import { PRIMARY_COLOR } from '@/hooks/api'

interface LoadingModalProps {
  visibility: boolean;
  setVisibility?: (visibility: boolean) => void;
  message?: string;
  text?: string;
  isloading?: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  visibility,
  setVisibility,
  message,
  text = "Please wait...",
  isloading = true,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visibility}
      onRequestClose={() => setVisibility?.(false)}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/50`}>
        <View style={tw`bg-white rounded-2xl p-6 shadow-xl min-w-[200px] items-center`}>
          {isloading && (
            <ActivityIndicator size="large" color={PRIMARY_COLOR} style={tw`mb-4`} />
          )}
          <Text style={tw`text-gray-700 text-base text-center font-medium`}>
            {message ?? text}
          </Text>
        </View>
      </View>
    </Modal>
  )
}

export default LoadingModal