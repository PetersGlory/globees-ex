import React from 'react'
import { Text, View, Modal, TouchableOpacity, Image} from 'react-native';
import tw from "twrnc"
import Ionicons from  '@expo/vector-icons/Ionicons'
import { useSelector } from 'react-redux';
import { selectUserProfile } from '../../../config/redux/slice';
import { ScrollView } from 'react-native';
import {shareAsync} from "expo-sharing"
import {captureRef} from "react-native-view-shot"
import { useRef } from 'react';

const TransactionModal = ({onpressed, visibility, data}) => {
  const usersProfile = useSelector(selectUserProfile);
  const viewTosnapShotRef = useRef();

  const PrintAsPDF = async () =>{
    // alert("I'm clicked")
    const result = await captureRef(viewTosnapShotRef);
    // console.log(result);
    await shareAsync(result, { UTI: '.pdf', mimeType: 'application/pdf' })
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibility}
      onpressed={onpressed}>
      <View
        style={{
          ...tw`flex flex-col flex-1 justify-center items-center`,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <TouchableOpacity style={tw`absolute top-5 right-5 z-10`} onPress={onpressed}>
            <Ionicons name='close-circle-outline' size={26} />
        </TouchableOpacity>
        <ScrollView
          style={tw`bg-white rounded-lg w-full h-full p-4 pt-5`} ref={viewTosnapShotRef}>
            <View style={tw`text-center flex items-center`}>
              {/* <Image source={require("../../../../assets/logo.png")} style={{
                width: 100,
                height: 100,
                tintColor: "#133A64"
              }} alt={'logo'} /> */}
              <Image source={require('../../../../assets/img/logo_dark.png')} style={{
                ...tw`rounded-full`,
                width: 100,
                height: 100
            }} alt='Avarter' />
            </View>
            
            <View style={tw`w-full items-center mt-3`}>
              <View style={tw`bg-gray-100 w-20 flex flex-col justify-center items-center p-2 rounded-full`}>
                <Text style={tw`text-center ${data?.status == "success" || data?.status == "successful" ? "text-green-700" : "text-red-600"}`}>{data?.status}</Text>
              </View>
              <View style={tw`mt-[20px] w-full`}>
                  
                  <View style={tw`flex flex-row items-center mt-2 justify-between`}>
                      <Text style={tw`text-gray-400`}>From</Text>
                      <Text style={tw`text-gray-800`}>{usersProfile?.fullname}</Text>
                  </View>
                  <View style={tw`flex flex-row items-center mt-2 justify-between`}>
                      <Text style={tw`text-gray-400`}>To</Text>
                      <Text style={tw`text-gray-800`}>Globees Ex</Text>
                  </View>
                  <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                      <Text style={tw`text-gray-400`}>Date</Text>
                      <Text style={tw`text-gray-800`}>{new Date(data?.created_at).toDateString()}</Text>
                  </View>
                  <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                      <Text style={tw`text-gray-400`}>Send</Text>
                      <Text style={tw`text-gray-800`}>{data?.amountsend}</Text>
                  </View>
                  <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                      <Text style={tw`text-gray-400`}>Received</Text>
                      <Text style={tw`text-gray-800`}>{data?.amountreceive}</Text>
                  </View>
                  {/* <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                      <Text style={tw`text-gray-400`}>Service Charge</Text>
                      <Text style={tw`text-gray-800 capitalize`}>{data?.service_charge}</Text>
                  </View> */}
                  <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                      <Text style={tw`text-gray-400`}>Transaction Type</Text>
                      <Text style={tw`text-gray-800 capitalize`}>{data?.category}</Text>
                  </View>
                  <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                      <Text style={tw`text-gray-400`}>Reciever Name</Text>
                      <Text style={tw`text-gray-800 capitalize`}>{data?.receiver_name}</Text>
                  </View>
                  <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                      <Text style={tw`text-gray-400`}>Bank Name</Text>
                      <Text style={tw`text-gray-800 capitalize`}>{data?.bank_name}</Text>
                  </View>
                  <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                      <Text style={tw`text-gray-400`}>Account Number</Text>
                      <Text style={tw`text-gray-800 capitalize`}>{data?.account_number}</Text>
                  </View>
                  {data?.category !== "exchange" && (
                    <View style={tw`w-full`}>                      
                      <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                          <Text style={tw`text-gray-400`}>Payment Reason</Text>
                          <Text style={tw`text-gray-800 capitalize`}>{data?.payment_reason}</Text>
                      </View>
                      <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                          <Text style={tw`text-gray-400`}>Student ID</Text>
                          <Text style={tw`text-gray-800 capitalize`}>{data.student_id !=='' ? data?.student_id : "N/A"}</Text>
                      </View>                      
                      <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                          <Text style={tw`text-gray-400`}>Iban</Text>
                          <Text style={tw`text-gray-800 capitalize`}>{data.iban !=='' ? data?.iban : "N/A"}</Text>
                      </View>
                      <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                          <Text style={tw`text-gray-400`}>Swift/Bic</Text>
                          <Text style={tw`text-gray-800 capitalize`}>{data.swift_bic !=='' ? data?.swift_bic: "N/A"}</Text>
                      </View>
                    </View>
                  )}
                  <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                      <Text style={tw`text-gray-400`}>Description</Text>
                      <Text style={tw`text-gray-800 text-right text-[12px] w-[65%]`}>Transaction of {data?.amountsend} made to GlobeesEx for {data?.category}</Text>
                  </View>
                  {/* <View style={tw`flex flex-row items-center mt-4 justify-between`}>
                      <Text style={tw`text-gray-400`}>Reference No.</Text>
                      <Text style={tw`text-gray-800`}>{data?.transaction_id}</Text>
                  </View> */}
              </View>
            </View>

            <View style={tw`w-full flex flex-row mt-4 items-center justify-between mb-5`}>
                <TouchableOpacity onPress={onpressed} style={tw`p-2 w-[45%] rounded-lg border-blue-800 border bg-white items-center`}>
                    <Text style={tw`text-blue-800`}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={PrintAsPDF} style={tw`bg-blue-800 w-[53%] flex flex-row rounded-lg justify-evenly items-center p-2`}>
                    <Ionicons name='share-social-outline' color={"#ffffff"} size={20} />
                    <Text style={tw`text-white`}>Share</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

export default TransactionModal