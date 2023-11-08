import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import tw from 'twrnc'

const PrimaryBtn = ({title, onpressed}) => {
  return (
    <TouchableOpacity style={{
        ...tw`rounded-2xl p-5 w-full`,
        backgroundColor: '#133A64'
    }} onPress={onpressed}>
      <Text style={tw`text-center font-medium text-white`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default PrimaryBtn