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
        }, 3500);
    }
  return (
    <SafeAreaView style={tw`flex-grow w-full h-full`}>
        <ImageBackground source={require("../../assets/img/8.png")} style={{
            ...tw`w-full h-full`,
        }}>
            <StatusBar style='inverted' />
            <Animated.View style={{
                ...tw`w-full h-full items-center justify-center`,
                opacity: fadeAnim,
            }}>

                <Image source={require("../../assets/img/payments.png")} style={{
                    width: 200,
                    height: 200
                }} alt='logo' />
                <Text style={[tw`text-white text-2xl font-bold mt-5`]}>Welcome to GLOBEES EX</Text>
                <Text style={[tw`text-yellow-400 text-center text-3xl font-bold mt-5 uppercase`]}>Exchange & Payment GateWay</Text>


                {/* <Text style={tw`absolute bottom-5 left-5 right-5 text-gray-100 text-center`}>Crafted and maintained by TECHTACLOUD.</Text> */}

            </Animated.View>
        </ImageBackground>
    </SafeAreaView>
  )
}

export default WelcomeScreen