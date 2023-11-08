import React, { useState } from 'react'
import { View, Text, SafeAreaView,ScrollView, Platform, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import CustomHeader from '../Components/common/CustomHeader'
import { StatusBar } from 'expo-status-bar'
import Icon from "@expo/vector-icons/Ionicons"
import LogOutModal from '../Components/common/Modals/LogOutModal'
import CustomLegal from '../Components/common/Modals/CustomLegal'
import CustomAbout from '../Components/common/Modals/CustomAbout'
import { Linking } from 'react-native'
import CustomSocial from '../Components/common/Modals/CustomSocial'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackActions, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { BASE_URL, unregisterID } from '../config/api/Index'
import { useSelector } from 'react-redux'
import { selectAccessToken } from '../config/redux/slice'
import LoadingModal from '../Components/common/Modals/LoadingModal'

const MoreScreen = ({navigation}) => {
    const navigator = useNavigation();
    const [enabled, setEnabled] = useState(false);
    const [enabledD, setEnabledD] = useState(false);
    const [about, setAbout] = React.useState(false);
    const [social, setSocial] = React.useState(false);
    const [modalL, setModalL] = React.useState(false);
    const [refresh, setRefresh] = useState(false);
    const key = useSelector(selectAccessToken)
    const [support, setSupport] = React.useState("Hi Globees Ex, I'm contacting from the app and I will need more enquiry. Thank you");
    const [links, setLinks] = useState([
        {title: "Profile", route: "ProfileScreen", icon: "md-person-circle-outline"},
        {title: "Transaction History", route: "TransactionScreen", icon: "md-time-outline"},
        {title: "Help & Support", route: "support", icon: "md-headset-outline"},
        {title: "Social Media", route: "social", icon: "md-thumbs-up-outline"},
        {title: "Our blog", route: "blog", icon: "md-newspaper-outline"},
        // {title: "App rating", route: "LegalScreen", icon: "md-star-half-outline"},
        {title: "About", route: "AboutScreen", icon: "md-alert-circle-outline"},
        {title: "Legal", route: "LegalScreen", icon: "md-document-text-outline"},
    ])

    const handleDelete = async () => {
        axios.request({
            method: 'GET',
            url: `${BASE_URL}/delete-account`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: 'Bearer '+ key
            }
        }).then(async (response)=>{
            if(response.status !==200 || response.status !== 201){
                setRefresh(false)
                await AsyncStorage.clear();
                navigator.dispatch(StackActions.replace("LoginScreen"))
            }else{
                if(response.data.error == false){
                    setRefresh(false)
                    unregisterID(key);
                }else{
                    setRefresh(false)
                }
            }
        }).catch((err)=>{
            console.error(err)
            setRefresh(false)
        })
    }
  return (
    <SafeAreaView style={tw`flex-grow bg-gray-200 w-full h-full pt-3`}>
        <StatusBar style="dark" />
        <ScrollView style={tw`p-5 h-full w-full ${Platform.OS === "ios" ? "p-5 h-full" : ""}`}>
            <CustomHeader title={"More"} />

            <View style={tw`w-full bg-white rounded-xl p-5 pt-2 mt-5`}>
                {links && links.map((items, i) =>(
                    <TouchableOpacity style={tw`flex flex-row mt-4 justify-between items-center border-b border-gray-200 pb-3`} key={i} onPress={()=> {
                    if(items.route == "LegalScreen"){
                        setModalL(true)
                    }else if(items.route == "AboutScreen"){
                        setAbout(true)
                    }else if(items.route == "blog"){
                        Linking.openURL("https://globeesex.blogspot.com/");
                    }else if(items.route == "social"){
                        setSocial(true);
                    }else if(items.route == "support"){
                        Linking.openURL('whatsapp://send?text=' + support + '&phone=447778068566').then((data) => {
                            console.log('WhatsApp Opened');
                          })
                          .catch(() => {
                            alert('Make sure Whatsapp installed on your device');
                          });
                    }else{
                        navigation.navigate(items.route)
                    }
                    }}>
                        <View style={tw`flex flex-row items-center`}>
                            <Icon name={items.icon} style={tw` text-gray-500`} size={20} />
                            <Text style={tw`text-[14px] ml-2 text-gray-500`}>{items.title}</Text>
                        </View>
                        <Icon name='md-chevron-forward-outline' style={tw` text-gray-500`} size={20} />
                    </TouchableOpacity>
                ))}
            </View>
            <View style={tw`bg-white rounded-2xl p-2 w-full mt-3 p-6`}>
                <TouchableOpacity style={tw`flex flex-row items-center pb-3 pt-3 border-b border-gray-200`} onPress={()=>navigation.navigate("AccountLimits")}>
                    <Icon name="md-person-circle-outline" style={tw` text-gray-500`} size={20} />
                    <Text style={tw`text-[14px] ml-2 text-gray-500`}>Account Limits</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw`flex flex-row items-center pb-3 pt-3 border-b border-gray-200`} onPress={()=>setEnabled(true)}>
                    <Icon name="md-arrow-undo-outline" style={tw` text-gray-500`} size={20} />
                    <Text style={tw`text-[14px] ml-2 text-gray-500`}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw`flex flex-row items-center pb-5 mt-3`} onPress={()=>setEnabledD(true)}>
                    <Icon name="md-trash-outline" style={tw`text-red-800`} size={20} />
                    <Text style={tw`text-[14px] ml-2 text-red-800`}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

        {enabled ? <LogOutModal visibility={enabled} setVisibility={setEnabled} text={"Are you sure you want to proceed to logout?"} onPressed={async ()=> {
            await AsyncStorage.removeItem("accessToken");
            navigator.dispatch(StackActions.replace("LoginScreen"));
            unregisterID(key);
        }} /> : null}
        {enabledD ? <LogOutModal visibility={enabledD} setVisibility={setEnabledD} text={"Are you sure you want to proceed in deleting your account?"} onPressed={handleDelete} /> : null}
        <CustomLegal visibility={modalL} setVisibility={setModalL} />
        <CustomAbout visibility={about} setVisibility={setAbout} />
        <CustomSocial visibility={social} setVisibility={setSocial} />
        <LoadingModal visibility={refresh} setVisibility={()=>setRefresh(false)} message={"Loading"} isloading={true} />
    </SafeAreaView>
  )
}

export default MoreScreen