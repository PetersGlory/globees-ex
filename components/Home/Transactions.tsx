import React, { useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import Icon from "@expo/vector-icons/Ionicons"
import { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { router } from 'expo-router'
import { selectAccessToken } from '@/hooks/redux/slice'
import { BASE_URL } from '@/hooks/api/Index'
import TransactionModal from '../common/Modals/TransactionModal'

interface Transactions {
    status?: string;
    amountsend?: string;
}
const Transactions = () => {
  const [modal, setModal] = useState(false);
  const key = useSelector(selectAccessToken)
  const [transactions, setTransaction] = useState<Transactions[]>([])

  useEffect(()=>{
    // Getting Profile
    axios.request({
        method: 'GET',
        url: `${BASE_URL}/transactions`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: 'Bearer '+ key
        }
    }).then((response)=>{
        if(response.data.error == false){
            setTransaction(response.data.message)
        }
    }).catch((err)=>{
        console.error(err)
    })
  },[])

  const [modalData, setModalData] = useState({})
  const handleClose = () =>{
      setModal(false)
  }
  return (
    <View style={tw`w-full h-full p-5 pt-[30%]`}>
        <View style={tw`flex flex-row items-center justify-between`}>
            <Text style={tw`text-xs text-gray-400`}>Today, Mar 23</Text>
            <TouchableOpacity style={tw`text-xs items-end`} onPress={()=> router.push("TransactionScreen" as never)}>
                <Text style={tw` text-blue-800`}>All Transactions <Icon name='chevron-forward' size={12} /></Text>
            </TouchableOpacity>
        </View>
        {transactions.length > 0 ? (
            <ScrollView style={tw`w-full mt-4 bg-gray-100`}>
                {transactions && transactions.map((transact, i)=>(
                <TouchableOpacity style={tw`rounded-lg p-3 mt-3 w-full flex flex-row bg-white justify-between items-center`} key={i} onPress={() => {
                    setModalData(transact);
                    setModal(true);
                }}>
                    <View style={tw`flex-1 flex flex-row items-center`}>
                        <Icon name='send-outline' style={tw`rounded-full w- p-3 text-${transact?.status === "successful" || transact?.status === "completed" ? "blue" : "red"}-800 bg-gray-100 items-center text-center`} />
                        <View style={tw`pl-3`}>
                            <Text style={tw`text-gray-800 text-[13px]`}>To Globees Ex</Text>
                            <Text style={tw`text-${transact?.status == "successful" || transact?.status == "completed" ? "blue" : "red"}-400 text-[10px] p-1`}>{transact?.status}</Text>
                        </View>
                    </View>
    
                    <View style={tw`flex-1 items-end`}>
                        <Text style={tw`text-gray-800 text-[12px]`}>Amount</Text>
                        <Text style={tw`text-${transact?.status == "successful" || transact?.status == "completed" ? "blue" : "red"}-800 text-[15px]`}>
                            {transact?.amountsend}
                        </Text>
                    </View>
                </TouchableOpacity>
                ))}
            </ScrollView>
        ) : (
            <ScrollView style={tw`w-full mt-4 bg-gray-100`}>
                <View style={tw`items-center justify-center mt-5`}>
                    <Icon name='alert-circle-outline' size={50} color={"#6B6B6C"} />
                    <Text style={tw`text-center mt-2 text-gray-600`}>Transaction History is empty</Text>
                </View>
            </ScrollView>
        )}
        {modal ? <TransactionModal onpressed={handleClose} visibility={modal} data={modalData} /> : null}
    </View>
  )
}

export default Transactions