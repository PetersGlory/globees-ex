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
    <SafeAreaView style={tw`flex-grow w-full h-full`}>
        <StatusBar style='auto' />
        <Image source={require("../../assets/img/new/1.png")} style={{
            ...tw`flex-1`,
            width: "100%",
            height: "100%",
            resizeMode: "cover"
        }} />
        {/* <ImageBackground source={require("../../assets/img/8.png")} style={{
            ...tw`w-full h-full flex flex-col items-center justify-between`,
        }}>
            <Animated.View style={{
                ...tw`w-full items-center justify-center flex-1 pt-5`,
                opacity: fadeAnim,
            }}>
                <Text style={[tw`text-white text-center text-[32px] font-medium mt-5 uppercase`]}>Globees Ex</Text>
                <Text style={[tw`text-white text-center text-[28px] font-medium mt-5 uppercase`]}>Exchange & Payment GateWay</Text>
            </Animated.View>

                <View style={tw`flex-1 w-full items-center justify-center pt-3`}>
                    <Image source={require("../../assets/img/logos.png")} style={{
                        width: 300,
                        height: 300
                    }} alt='logo' />
                </View>
                <View style={tw`flex-1 justify-end pb-2`}>

                    <Text style={tw`text-white text-center text-[15px]`}>@globees.ex</Text>
                </View>
        </ImageBackground> */}
    </SafeAreaView>
  )
}

export default WelcomeScreen