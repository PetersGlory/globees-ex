import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, TextInput, Platform, ScrollView } from 'react-native'
import tw from "twrnc"
import CustomHeader from '../Components/common/CustomHeader'
import { StatusBar } from 'expo-status-bar'
import PrimaryBtn from '../Components/common/PrimaryBtn'
import { SelectList } from 'react-native-dropdown-select-list'
import LogOutModal from '../Components/common/Modals/LogOutModal'
import { useDispatch } from 'react-redux'
import { setReceiver } from '../config/redux/slice'

const ReceiverScreen = ({navigation, route}) => {
    const [selected, setSelected] = useState("");
    const typeR = route.params.request_type;
    const currency_from = route.params.currency_from;
    const currency_to = route.params.currency_to;
    const [enabled, setEnabled] = useState(false);
    const dispatch = useDispatch()
    const [accounts, setAccounts] = useState({
        account_name: '',
        bank_name: "",
        account_number: "",
        sort_code: "",
        payment_reason: "",
        student_id : "",
        iban: "",
        swift_bic:"",
        address: ""
    })

    const data = [
        {key:'2', value:'Tuition fees'},
        {key:'3', value:'Online purchases'},
        {key:'4', value:'Others'},
    ]

    const handleSelectTo =(val) =>{
        setSelected(val);
        setAccounts({
            ...accounts,
            payment_reason: val
        })
    }


    const handleContinue = (val) =>{
        setEnabled(false);
        if(accounts.account_name !== "" && accounts.bank_name !== "" && accounts.account_number !== ""){
            dispatch(setReceiver(accounts));
            navigation.push("SummaryScreen",{
                category: typeR,
                currency_from: currency_from,
                currency_to:currency_to
            });        
        }else{
            alert('All fields are required.')
        }
    }
  return (
    <SafeAreaView style={tw`bg-gray-100 w-full h-full p-5`}>
        <StatusBar style='dark' />
        <ScrollView style={tw`w-full h-full ${Platform.OS =="ios"&& "p-5 h-full w-full"}`}>
            <CustomHeader title={"Receivers Details"} />

            <Text style={tw`text-center text-gray-500 mt-5 text-[12px]`}>
                Kindly enter the correct receiver’s account details required to continue..
            </Text>

            <View style={tw`mt-10 w-full`}>
                <TextInput placeholder='Recipient Name' value={accounts.account_name} onChangeText={(val)=>{
                    setAccounts({
                        ...accounts,
                        account_name: val
                    })
                }} keyboardType="default" style={tw`p-[12px] rounded-lg border border-gray-300`} />
                <TextInput placeholder='Bank Name' value={accounts.bank_name} onChangeText={(val)=>{
                    setAccounts({
                        ...accounts,
                        bank_name: val
                    })
                }} keyboardType="default" style={tw`p-[12px] rounded-lg border border-gray-300 mt-3`} />
                <TextInput placeholder='Account Number' value={accounts.account_number} onChangeText={(val)=>{
                    setAccounts({
                        ...accounts,
                        account_number: val
                    })
                }} keyboardType="number-pad" style={tw`p-[12px] rounded-lg border border-gray-300 mt-3`} />
                {currency_to == "UK" && typeR == "payment" && (
                    <TextInput placeholder='Sort Code' value={accounts.sort_code} onChangeText={(val)=>{
                        setAccounts({
                            ...accounts,
                            sort_code: val
                        })
                    }} keyboardType="number-pad" maxLength={6} style={tw`p-[12px] rounded-lg border border-gray-300 mt-3`} />
                )}
                {currency_from == "NGN" && typeR == "exchange" && (
                    <TextInput placeholder='Sort Code' value={accounts.sort_code} onChangeText={(val)=>{
                        setAccounts({
                            ...accounts,
                            sort_code: val
                        })
                    }} keyboardType="number-pad" maxLength={6} style={tw`p-[12px] rounded-lg border border-gray-300 mt-3`} />
                )}

                {typeR !== "exchange" && typeR !== "crypto" && (
                    <View style={tw`w-full`}>
                        <SelectList 
                            setSelected={(val) => {
                            handleSelectTo(val)
                            }}
                            placeholder='Reason for payment'
                            boxStyles={{
                            marginTop:15,
                            padding:15
                            }}
                            data={data}
                            save='value' 
                        />

                        {selected === "Tuition fees" && (
                            <TextInput placeholder='Student ID' value={accounts.student_id} onChangeText={(val)=>{
                                setAccounts({
                                    ...accounts,
                                    student_id: val
                                })
                            }} keyboardType="default" style={tw`p-[12px] rounded-lg border border-gray-300 mt-3`} />
                        )}
                    </View>
                )}

                {typeR !== "exchange" || currency_to == "UK" || typeR !== "crypto" && (
                    <View style={tw`w-full`}>
                        <TextInput placeholder='IBAN' value={accounts.iban} onChangeText={(val)=>{
                            setAccounts({
                                ...accounts,
                                iban: val
                            })
                        }} keyboardType="default" style={tw`p-[12px] rounded-lg border border-gray-300 mt-3`} />
                        <TextInput placeholder='SWIFT/BIC' value={accounts.swift_bic} onChangeText={(val)=>{
                            setAccounts({
                                ...accounts,
                                swift_bic: val
                            })
                        }} keyboardType="default" style={tw`p-[12px] rounded-lg border border-gray-300 mt-3`} />
                        <TextInput placeholder='Recipient Address' value={accounts.address} onChangeText={(val)=>{
                            setAccounts({
                                ...accounts,
                                address: val
                            })
                        }} keyboardType="default" style={tw`p-[12px] rounded-lg border border-gray-300 mt-3`} />
                    </View>
                )}
            </View>

            {/* Button */}
            <View style={tw`mt-5 w-full flex flex-col items-center`}>
                <PrimaryBtn title={"Continue"} onpressed={()=>setEnabled(true)} />
            </View>
        </ScrollView>

        {enabled ? <LogOutModal visibility={enabled} setVisibility={setEnabled} text={`Are you sure you want to proceed?`} onPressed={handleContinue} /> : null}
    </SafeAreaView>
  )
}

export default ReceiverScreen