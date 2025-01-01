import { PRIMARY_COLOR } from '@/hooks/api/Index'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React,{ useRef, useEffect } from 'react'
import { Image } from 'react-native'
import { View, Text, SafeAreaView, Animated } from 'react-native'
import tw from  "twrnc"

const WelcomeScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(()=>{
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: true,
        }).start();

        newScreen();
    }, [fadeAnim])

    const newScreen = () =>{
        setTimeout(()=>{
            router.replace("/IntroductionScreen");
        }, 4500);
    }
  return (
    <SafeAreaView style={tw`flex-grow w-full items-center justify-center h-full bg-[${PRIMARY_COLOR}]`}>
        <StatusBar style="light" /> 
        <View style={tw`flex-1`} />
        <View style={tw`flex-1 w-full h-full items-center px-5 py-3 mb-5 mt-5`}>
            <Text style={[tw`text-white text-center text-3xl font-semibold`]}>{"Exchange and \n\ Payment Gateway"}</Text>
        </View>
        <View style={tw`flex-1`}>
            <Image source={require("../assets/images/logo.png")} style={{
            width: 150,
            height: 150,
            }} alt="intro" />
        </View>
        <View style={tw`flex-1`} />
        <View style={tw`flex-1 w-full h-full items-center`}>
            <Text style={[tw`text-white text-center text-xl mb-5 mt-5`]}>Getting started ...</Text>
        </View>
        <View style={tw`flex-1`} />
        <View style={tw`flex-1`} />
    </SafeAreaView>
  )
}

export default WelcomeScreen