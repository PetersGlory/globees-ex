import { PRIMARY_COLOR } from '@/hooks/api/Index'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import tw from 'twrnc'

interface PrimaryBtnProps {
  title: string;
  onpressed: () => void;
}
const PrimaryBtn: React.FC<PrimaryBtnProps> = ({title, onpressed}) => {
  return (
    <TouchableOpacity style={{
        ...tw`rounded-2xl p-5 w-full`,
        backgroundColor: PRIMARY_COLOR
    }} onPress={onpressed}>
      <Text style={tw`text-center font-medium text-white`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default PrimaryBtn