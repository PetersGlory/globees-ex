import React, {useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import tw from "twrnc"
import Header from '../Components/Home/Header'
import Icon from "@expo/vector-icons/Ionicons"
import Transactions from '../Components/Home/Transactions'
import LoadingModal from '../Components/common/Modals/LoadingModal'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '../config/redux/slice'
import { useEffect } from 'react'

const HomeScreen = ({navigation}) => {
  const [modal, setModal] = useState(true);
  const userProfile = useSelector(selectUserProfile)
  
  useEffect(()=>{
    if(userProfile !== null){
      setModal(false);
    }else{
      setModal(true);
    }
  })
  return (
    <SafeAreaView style={{
      ...tw`pt-10 w-full flex-grow`,
      backgroundColor: "#133A64"
    }}>
      <StatusBar style='inverted' />
      <View style={tw`h-[30%] w-full`}>
        <Header />
      </View>

      {/* 2 cards */}
      <View style={tw`absolute left-5 right-5 top-[20%] rounded-lg z-10 flex flex-row items-center justify-between`}>
        <TouchableOpacity style={tw`shadow w-[48%] rounded-2xl pt-6 pl-5 pr-5 pb-6 shadow bg-white flex flex-col`} onPress={()=> navigation.push("ExchangeScreen")}>
          <Icon name='md-contract-outline' size={30} style={tw`text-blue-900`} />
          <Text style={tw`mt-5 text-gray-700 text-left font-bold`}>Exchange</Text>
          <Text style={tw`mt-2 text-gray-600 text-left text-xs`}>Click here to exchange the fiat currency of your choice.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`shadow w-[48%] rounded-2xl pt-8 pl-5 pr-5 pb-8 shadow bg-white flex flex-col`} onPress={()=> navigation.push("PaymentScreen")}>
          {/* <Icon name='md-card-outline' size={30} style={tw`text-gray-700`} /> */}
          <Image source={require("../../assets/img/payments.png")} style={{
            width: 26,
            height: 26,
          }} />
          <Text style={tw`mt-5 text-gray-700 text-left font-bold`}>Payment Gateway</Text>
          <Text style={tw`mt-2 text-gray-600 text-left text-xs`}>Click to tranfer money abroad.</Text>
        </TouchableOpacity>
      </View>

      {/* Other Aspects */}
      <View style={tw`w-full rounded-t-2xl bg-gray-100 h-[70%]`}>
        <Transactions />
      </View>
      <LoadingModal message={"Loading..."} isloading={true} visibility={modal} setVisibility={setModal} />
    </SafeAreaView>
  )
}

export default HomeScreen