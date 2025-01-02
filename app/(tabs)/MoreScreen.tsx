import React, { useState } from 'react'
import { View, Text, SafeAreaView,ScrollView, Platform, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import { StatusBar } from 'expo-status-bar'
import Icon from "@expo/vector-icons/Ionicons"
import { Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { router } from 'expo-router'
import { selectAccessToken, selectUserProfile } from '@/hooks/redux/slice'
import { BASE_URL } from '@/hooks/api/Index'
import CustomHeader from '@/components/common/CustomHeader'
import LogOutModal from '@/components/common/Modals/LogOutModal'
import CustomLegal from '@/components/common/Modals/CustomLegal'
import CustomAbout from '@/components/common/Modals/CustomAbout'
import CustomSocial from '@/components/common/Modals/CustomSocial'
import LoadingModal from '@/components/common/Modals/LoadingModal'

const MoreScreen = () => {
    const userProfile = useSelector(selectUserProfile);
    const [enabled, setEnabled] = useState(false);
    const [enabledD, setEnabledD] = useState(false);
    const [about, setAbout] = React.useState(false);
    const [social, setSocial] = React.useState(false);
    const [modalL, setModalL] = React.useState(false);
    const [refresh, setRefresh] = useState(false);
    const key = useSelector(selectAccessToken)
    const [support, setSupport] = React.useState("Hi Globees Ex, I'm contacting from the app and I will need more enquiry. Thank you");
    const [links, setLinks] = useState([
        {title: "Profile", route: "ProfileScreen", icon: "person-circle-outline"},
        {title: "Transaction History", route: "TransactionScreen", icon: "time-outline"},
        {title: "Identity Verification", route: "IdentityVerification", icon: "id-card-outline"},
        {title: "Rewards", route: "RewardsScreen", icon: "gift-outline"},
        {title: "Social Media", route: "social", icon: "thumbs-up-outline"},
        {title: "Blog", route: "blog", icon: "newspaper-outline"},
        {title: "About", route: "AboutScreen", icon: "alert-circle-outline"},
        {title: "Legal", route: "LegalScreen", icon: "document-text-outline"},
        {title: "Help & Support", route: "support", icon: "headset-outline"},
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
        }).then(async (response:any)=>{
            if(response.status !==200 || response.status !== 201){
                setRefresh(false)
                await AsyncStorage.clear();
                setEnabledD(false);
                setTimeout(()=>{                    
                    router.replace("/LoginScreen")
                }, 1500);
            }else{
                if(response.data.error == false){
                    setRefresh(false)
                    // unregisterID(key);
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

            <View style={tw`w-full bg-white rounded-xl py-3.5 px-5 mt-5`}>
                {links && links.map((items, i) =>(
                    <TouchableOpacity style={tw`flex flex-row mt-3 justify-between items-center border-b border-gray-200 pb-3`} key={i} onPress={()=> {
                    if(items.route == "LegalScreen"){
                        setModalL(true)
                    }else if(items.route == "AboutScreen"){
                        setAbout(true)
                    }else if(items.route == "IdentityVerification"){
                        if(userProfile?.verified_user == "yes"){
                            alert("You've already verified your account.")
                        }else{
                            router.navigate(items.route as never);
                        }
                    }
                    else if(items.route == "blog"){
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
                        router.navigate(items.route as never)
                    }
                    }}>
                        <View style={tw`flex flex-row items-center`}>
                            <Icon name={items.icon as never} style={tw` text-gray-500`} size={20} />
                            <Text style={tw`text-[14px] ml-2 text-gray-500`}>{items.title}</Text>
                        </View>
                        <Icon name='chevron-forward-outline' style={tw` text-gray-500`} size={20} />
                    </TouchableOpacity>
                ))}
            </View>
            <View style={tw`bg-white rounded-2xl p-2 w-full mt-3 p-6`}>
                <TouchableOpacity style={tw`flex flex-row items-center pb-3 pt-3 border-b border-gray-200`} onPress={()=>router.push("/AccountLimits" as never)}>
                    <Icon name="person-circle-outline" style={tw` text-gray-500`} size={20} />
                    <Text style={tw`text-[14px] ml-2 text-gray-500`}>Account Limits</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw`flex flex-row items-center pb-3 pt-3 border-b border-gray-200`} onPress={()=>setEnabled(true)}>
                    <Icon name="arrow-undo-outline" style={tw` text-gray-500`} size={20} />
                    <Text style={tw`text-[14px] ml-2 text-gray-500`}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw`flex flex-row items-center pb-5 mt-3`} onPress={()=>setEnabledD(true)}>
                    <Icon name="trash-outline" style={tw`text-red-800`} size={20} />
                    <Text style={tw`text-[14px] ml-2 text-red-800`}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

        {enabled ? <LogOutModal visibility={enabled} setVisibility={setEnabled} text={"Are you sure you want to proceed to logout?"} onPressed={async ()=> {
            await AsyncStorage.removeItem("accessToken");
            setEnabled(false);
            setTimeout(()=>{
                router.replace("/LoginScreen");
            },1500);
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