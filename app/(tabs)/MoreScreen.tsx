import React, { useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, Platform, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import { StatusBar } from 'expo-status-bar'
import Icon from "@expo/vector-icons/Ionicons"
import { Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { router } from 'expo-router'
import { selectAccessToken, selectUserProfile } from '@/hooks/redux/slice'
import { BASE_URL, PRIMARY_COLOR } from '@/hooks/api/Index'
import CustomHeader from '@/components/common/CustomHeader'
import LogOutModal from '@/components/common/Modals/LogOutModal'
import CustomLegal from '@/components/common/Modals/CustomLegal'
import CustomAbout from '@/components/common/Modals/CustomAbout'
import CustomSocial from '@/components/common/Modals/CustomSocial'
import LoadingModal from '@/components/common/Modals/LoadingModal'
import app from '../../app.json'

const MoreScreen = () => {
    const userProfile = useSelector(selectUserProfile);
    const [enabled, setEnabled] = useState(false);
    const [enabledD, setEnabledD] = useState(false);
    const [about, setAbout] = React.useState(false);
    const [social, setSocial] = React.useState(false);
    const [modalL, setModalL] = React.useState(false);
    const [refresh, setRefresh] = useState(false);
    const key = useSelector(selectAccessToken)
    const [support] = React.useState("Hi Globees Ex, I'm contacting from the app and I will need more enquiry. Thank you");
    
    const [links, setLinks] = useState([
        {title: "Profile", route: "ProfileScreen", icon: "person-circle-outline", color: "blue"},
        {title: "Transaction History", route: "TransactionScreen", icon: "time-outline", color: "green"},
        {title: "Identity Verification", route: "IdentityVerify", icon: "id-card-outline", color: "purple"},
        {title: "Rewards", route: "RewardsScreen", icon: "gift-outline", color: "yellow"},
        {title: "Social Media", route: "social", icon: "thumbs-up-outline", color: "pink"},
        {title: "Blog", route: "blog", icon: "newspaper-outline", color: "indigo"},
        {title: "About", route: "AboutScreen", icon: "alert-circle-outline", color: "gray"},
        {title: "Legal", route: "LegalScreen", icon: "document-text-outline", color: "red"},
        {title: "Help & Support", route: "support", icon: "headset-outline", color: "teal"},
    ])

    const getIconColor = (color: string) => {
        const colors: { [key: string]: string } = {
            blue: "#3b82f6",
            green: "#10b981",
            purple: "#8b5cf6",
            yellow: "#f59e0b",
            pink: "#ec4899",
            indigo: "#6366f1",
            gray: "#6b7280",
            red: "#ef4444",
            teal: "#14b8a6"
        };
        return colors[color] || "#6b7280";
    };

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
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <StatusBar style="dark" />
            <ScrollView 
                style={tw`flex-1`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-6`}
            >
                <View style={tw`px-2 pt-3`}>
                    <CustomHeader title="Settings" />
                    
                    {/* User Profile Section */}
                    <View style={tw`bg-white rounded-2xl p-5 mt-2 mb-6 border border-gray-100`}>
                        <View style={tw`flex-row items-center mb-4`}>
                            <View style={tw`bg-white w-20 h-20 rounded-full items-center justify-center mr-5 shadow-md border-2 border-blue-200`}>
                                <Icon name="person-circle-outline" size={48} color={PRIMARY_COLOR} />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-2xl font-extrabold text-gray-900 mb-1`}>
                                    {userProfile?.fullname || "User"}
                                </Text>
                                <Text style={tw`text-gray-500 text-base mb-2`}>
                                    {userProfile?.email || "user@example.com"}
                                </Text>
                                <View style={tw`flex-row items-center mt-1`}>
                                    <View style={tw`${userProfile?.verified_user === "yes" ? "bg-green-100" : "bg-red-100"} px-3 py-1 rounded-full flex-row items-center`}>
                                        <Icon 
                                            name={userProfile?.verified_user === "yes" ? "checkmark-circle" : "close-circle"} 
                                            size={16} 
                                            color={userProfile?.verified_user === "yes" ? "#22c55e" : "#ef4444"} 
                                            style={tw`mr-1`} 
                                        />
                                        <Text style={tw`${userProfile?.verified_user === "yes" ? "text-green-700" : "text-red-600"} text-xs font-semibold`}>
                                            {userProfile?.verified_user === "yes" ? "Verified" : "Unverified"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={tw`flex-row justify-end`}>
                            <TouchableOpacity
                                style={tw`flex-row items-center bg-[${PRIMARY_COLOR}] px-4 py-2 rounded-full shadow-md`}
                                activeOpacity={0.85}
                                onPress={() => router.navigate("ProfileScreen" as never)}
                            >
                                <Icon name="create-outline" size={18} color="#fff" style={tw`mr-2`} />
                                <Text style={tw`text-white font-bold text-sm`}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Main Menu Section */}
                    <View style={tw`bg-white rounded-2xl border border-gray-100 mb-6`}>
                        <View style={tw`p-4 border-b border-gray-100`}>
                            <Text style={tw`text-lg font-bold text-gray-900`}>Account & Services</Text>
                        </View>
                        {links && links.map((items, i) => (
                            <TouchableOpacity 
                                style={tw`flex-row items-center justify-between p-4 border-b border-gray-100 last:border-b-0`} 
                                key={i} 
                                onPress={() => {
                                    if(items.route == "LegalScreen"){
                                        setModalL(true)
                                    }else if(items.route == "AboutScreen"){
                                        setAbout(true)
                                    }else if(items.route == "IdentityVerify"){
                                        if(userProfile?.verified_user == "yes" || userProfile?.verified_user == "true"){
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
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={tw`flex-row items-center flex-1`}>
                                    <View style={tw`bg-gray-50 w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                        <Icon 
                                            name={items.icon as never} 
                                            size={20} 
                                            color={getIconColor(items.color)} 
                                        />
                                    </View>
                                    <Text style={tw`text-gray-800 font-medium text-base`}>
                                        {items.title}
                                    </Text>
                                </View>
                                <Icon name='chevron-forward' size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Account Management Section */}
                    <View style={tw`bg-white rounded-2xl border border-gray-100 mb-6`}>
                        <View style={tw`p-4 border-b border-gray-100`}>
                            <Text style={tw`text-lg font-bold text-gray-900`}>Account Management</Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={tw`flex-row items-center justify-between p-4 border-b border-gray-100`} 
                            onPress={() => router.push("/AccountLimits" as never)}
                            activeOpacity={0.7}
                        >
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`bg-blue-50 w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icon name="shield-checkmark-outline" size={20} color="#3b82f6" />
                                </View>
                                <Text style={tw`text-gray-800 font-medium text-base`}>Account Limits</Text>
                            </View>
                            <Icon name='chevron-forward' size={20} color="#9ca3af" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={tw`flex-row items-center justify-between p-4 border-b border-gray-100`} 
                            onPress={() => setEnabled(true)}
                            activeOpacity={0.7}
                        >
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`bg-orange-50 w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icon name="log-out-outline" size={20} color="#f97316" />
                                </View>
                                <Text style={tw`text-gray-800 font-medium text-base`}>Logout</Text>
                            </View>
                            <Icon name='chevron-forward' size={20} color="#9ca3af" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={tw`flex-row items-center justify-between p-4`} 
                            onPress={() => setEnabledD(true)}
                            activeOpacity={0.7}
                        >
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`bg-red-50 w-10 h-10 rounded-xl items-center justify-center mr-3`}>
                                    <Icon name="trash-outline" size={20} color="#ef4444" />
                                </View>
                                <Text style={tw`text-red-600 font-medium text-base`}>Delete Account</Text>
                            </View>
                            <Icon name='chevron-forward' size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>

                    {/* App Version Info */}
                    <View style={tw`bg-white rounded-2xl p-4 border border-gray-100`}>
                        <Text style={tw`text-center text-gray-500 text-sm`}>
                            GlobeesEx v{app.expo.version}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Modals */}
            {enabled ? (
                <LogOutModal 
                    visibility={enabled} 
                    setVisibility={setEnabled} 
                    text={"Are you sure you want to proceed to logout?"} 
                    onPressed={async ()=> {
                        await AsyncStorage.removeItem("accessToken");
                        setEnabled(false);
                        setTimeout(()=>{
                            router.replace("/LoginScreen");
                        },1500);
                    }} 
                />
            ) : null}
            
            {enabledD ? (
                <LogOutModal 
                    visibility={enabledD} 
                    setVisibility={setEnabledD} 
                    text={"Are you sure you want to proceed in deleting your account?"} 
                    onPressed={handleDelete} 
                />
            ) : null}
            
            <CustomLegal visibility={modalL} setVisibility={setModalL} />
            <CustomAbout visibility={about} setVisibility={setAbout} />
            <CustomSocial visibility={social} setVisibility={setSocial} />
            
            <LoadingModal 
                visibility={refresh} 
                text="Loading..." 
            />
        </SafeAreaView>
    )
}

export default MoreScreen