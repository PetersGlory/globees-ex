import { PRIMARY_COLOR } from '@/hooks/api/Index'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import tw from 'twrnc'

interface SecondaryBtnProps {
  title: string;
  onpressed: () => void;
}

const SecondaryBtn: React.FC<SecondaryBtnProps> = ({title, onpressed}) => {
  return (
    <TouchableOpacity style={{
        ...tw`rounded-2xl p-3 w-full`,
        backgroundColor: '#ffd301'
    }} onPress={onpressed}>
      <Text style={tw`text-center font-bold text-[${PRIMARY_COLOR}] text-xl`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default SecondaryBtn