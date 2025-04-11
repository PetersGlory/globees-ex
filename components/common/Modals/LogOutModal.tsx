import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import Icon from "@expo/vector-icons/Ionicons"
import tw from "twrnc"
import { PRIMARY_COLOR } from '@/hooks/api/Index'

interface LogOutModalProps {
  visibility: boolean;
  setVisibility: (value: boolean) => void;
  text: string;
  onPressed: () => void;
}

const LogOutModal: React.FC<LogOutModalProps> = ({visibility, setVisibility, text, onPressed}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visibility}
      onRequestClose={() => setVisibility(false)}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/50 px-4`}>            
        <View style={tw`bg-white w-full max-w-[350px] rounded-2xl p-6 shadow-xl`}>                
          <View style={tw`items-center mb-4`}>
            <View style={tw`bg-red-50 rounded-full p-3 mb-4`}>
              <Icon 
                name="alert-circle" 
                size={40} 
                color="#EF4444"
              />
            </View>
            <Text style={tw`text-xl font-semibold text-gray-900 mb-2`}>
              Confirm Action
            </Text>
            <Text style={tw`text-center text-gray-600 text-base`}>
              {text}
            </Text>
          </View>

          <View style={tw`flex-row items-center justify-between gap-3 mt-4`}>
            <TouchableOpacity 
              onPress={() => setVisibility(false)}
              style={tw`flex-1 py-3 px-4 rounded-xl border border-gray-200 bg-gray-50`}
            >
              <Text style={tw`text-gray-700 text-center font-medium`}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onPressed}
              style={tw`flex-1 py-3 px-4 rounded-xl bg-red-500`}
            >
              <Text style={tw`text-white text-center font-medium`}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default LogOutModal