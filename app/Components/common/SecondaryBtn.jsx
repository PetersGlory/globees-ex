import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import { PRIMARY_COLOR } from '../../config/api/Index'

const SecondaryBtn = ({title, onpressed}) => {
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