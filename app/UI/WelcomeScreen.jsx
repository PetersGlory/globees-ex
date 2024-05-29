import { StackActions, useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React,{ useRef, useEffect } from 'react'
import { Image, ImageBackground } from 'react-native'
import { View, Text, SafeAreaView, Animated } from 'react-native'
import tw from  "twrnc"

const WelcomeScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigator = useNavigation();
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
            navigator.dispatch(StackActions.replace("IntroScreen"));
        }, 4500);
    }
  return (
    <SafeAreaView style={tw`flex-grow w-full items-center justify-center h-full bg-[#133A64]`}>
        <StatusBar style="light" /> 
        <View style={tw`flex-1`} />
        <View style={tw`flex-1 w-full h-full items-center p-5`}>
            <Text style={[tw`text-white text-center text-3xl font-semibold mb-5 mt-5`]}>{"Exchange and \n\ Payment Gateway"}</Text>
        </View>
        <View style={tw`flex-1`}>
            <Image source={require("../../assets/img/logos.png")} style={{
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