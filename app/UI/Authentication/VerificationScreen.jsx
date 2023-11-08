import React, { useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native'
import tw from 'twrnc'
import Icon from  "@expo/vector-icons/Ionicons"
import PrimaryBtn from '../../Components/common/PrimaryBtn'
import LoadingModal from '../../Components/common/Modals/LoadingModal'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, GENERAL_URL, sendpush, updatedevicetoken } from '../../config/api/Index'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setAccessToken, setRates, setUserProfile } from '../../config/redux/slice'
import { StackActions, useNavigation } from '@react-navigation/native'
import { registerIndieID } from 'native-notify';

const VerificationScreen = ({navigation, route}) => {
    const [loading, setLoading] = useState(true);
    const navigator = useNavigation()
    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState('Verifying....');
    const [code, setCode] = useState("");
    const dispatch = useDispatch()
    const handleLogin = () =>{
        setMessage("Loading...");
        setModal(true);
        setLoading(true);
        let datas = {
            email: route.params.email,
            codes: code
        }
        if(code !== ""){
            axios.post(`${BASE_URL}/verify/code`,datas).then(async (result)=>{
                console.log(result.data);
                const datas = result.data;
                setMessage(datas.message);
                if(!datas.error){
                    setLoading(false);
                    await AsyncStorage.setItem('accessToken', datas.accessToken);
                    registerIndieID(datas.accessToken, 14312, 'NRKYt9PycbIzkLWoNHDK1o');
                    dispatch(setAccessToken(datas.accessToken))
                    await AsyncStorage.setItem('accessTokenF', datas.accessToken);
                    getProfile(datas.accessToken)
                    getRates();
                    updatedevicetoken(route.params.email,datas.accessToken)
                    setTimeout(()=>{
                        navigator.dispatch(StackActions.replace("HomeScreen"))
                        // navigation.replace("HomeScreen");
                        setModal(false);
                        sendpush('Sign In', `Howdy ${route.params.email} 👋, you just signed in to Globees Ex now.`,datas.accessToken);
                    }, 3000);
                }else{
                    setTimeout(()=>{
                        // navigation.push("VerificationScreen");
                        setModal(false);
                        setLoading(false);
                    }, 3000);
                }
            }).catch((err) => {
                setMessage(err.message);
                setTimeout(()=>{
                    // navigation.push("VerificationScreen");
                    setModal(false);
                    setLoading(false);
                }, 3000);
                console.log(err);
            })
        }else{
            setMessage("All fields are required.");
            setTimeout(()=>{
                // navigation.push("VerificationScreen");
                setModal(false);
                setLoading(false);
            }, 3000);
        }
    }

    // Getting Profile
    const getProfile = (key) =>{
        axios.request({
            method: 'GET',
            url: `${BASE_URL}/profile`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: 'Bearer '+key
            }
        }).then((response)=>{
            let dataUser = response.data.data;
            dispatch(setUserProfile(dataUser));
        }).catch((err)=>{
            console.error(err)
        })
      }
  
      // Getting Rates
      const getRates = () =>{
        axios.request({
            method: 'GET',
            url: `${GENERAL_URL}/rates`
        }).then((response)=>{
            let dataRate = response.data.message;
            dispatch(setRates(dataRate));
        }).catch((err)=>{
            console.error(err)
        })
      }
  return (
    <SafeAreaView style={tw`flex-grow w-full h-full bg-white p-5 pt-15`}>
      <ScrollView style={tw`h-full w-full ${Platform.OS == "ios"? " p-5 pt-15" : ""}`}>
        <TouchableOpacity style={tw`w-12 p-2 border border-gray-400 rounded-lg`} onPress={()=>navigation.goBack()}>
            <Icon name='md-chevron-back' color={"#133A64"} size={26} />
        </TouchableOpacity>

            {/* Greetings */}
        <View style={tw`mt-[30px]`}>
            <Text style={{
                ...tw`text-[24px] font-medium`,
                color:'#133A64'
            }}>Verify it’s you</Text>
            <Text style={tw`text-gray-400 text-[14px] mt-[8px]`}>
                We send a code to ( {route.params.email} ). Enter it here to verify your identity
            </Text>
        </View>

        {/* Forms */}
        <View style={tw`mt-[32px] w-full items-center`}>
            <SmoothPinCodeInput
                value={code}
                onTextChange={codes => {
                    setCode(codes);
                }}
                mask="*"
                cellSize={56}
                cellSpacing={9}
                codeLength={5}
                maxDelay={200}
                cellStyle={{
                    borderWidth: 1,
                    borderColor:"#C1B8D1",
                    borderRadius: 12,
                }}
                cellStyleFocused={{
                    backgroundColor: "#ffffff"
                }}
            />
            <TouchableOpacity style={tw`justify-center items-center mt-[8px] font-bold`} onPress={()=>{
                alert("Code Resent.")
            }}>
                <Text style={tw`text-red-700 font-bold text-[15px]`}>Resend code</Text>
            </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={tw`mt-10 w-full flex flex-col items-center`}>
            <PrimaryBtn title={"Confirm"} onpressed={handleLogin} />
        </View>
      </ScrollView>
      
        <LoadingModal  visibility={modal} setVisibility={setModal} message={message} isloading={loading} />
    </SafeAreaView>
  )
}

export default VerificationScreen