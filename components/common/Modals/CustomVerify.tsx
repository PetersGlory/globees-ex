import React from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import Icon from '@expo/vector-icons/Ionicons'

interface CustomVerifyProps {
  visibility: boolean;
  setVisibility: (visible: boolean) => void;
}

export default function CustomVerify({ visibility, setVisibility }: CustomVerifyProps) {
  const close = () => setVisibility(false)

  return (
    <Modal
      visible={visibility}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <View style={tw`flex-1 bg-black/50 items-center justify-center px-6`}>
        <View style={tw`w-full bg-white rounded-2xl p-6 border border-gray-100`}>
          <View style={tw`items-center mb-4`}>
            <View style={tw`bg-green-50 w-16 h-16 rounded-full items-center justify-center mb-3`}>
              <Icon name="shield-checkmark" size={28} color="#16a34a" />
            </View>
            <Text style={tw`text-lg font-bold text-gray-900`}>Already Verified</Text>
            <Text style={tw`text-gray-600 text-center mt-2`}>Your account has already been verified. You have full access to all features.</Text>
          </View>

          <View style={tw`flex-row items-center justify-center mt-2`}>
            <TouchableOpacity
              style={tw`px-5 py-3 rounded-xl bg-green-600`}
              onPress={close}
              activeOpacity={0.85}
            >
              <Text style={tw`text-white font-semibold`}>Great!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
