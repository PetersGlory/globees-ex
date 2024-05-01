import React, { useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { Platform } from 'react-native'
import tw from 'twrnc'
import Icon from  "@expo/vector-icons/Ionicons"
import PrimaryBtn from '../../Components/common/PrimaryBtn'
import LoadingModal from '../../Components/common/Modals/LoadingModal'
import axios from 'axios'
import { BASE_URL } from '../../config/api/Index'

const ForgotPassword = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState('Loading....');
    const [logins, setLogins] = useState({
        email:"",
    })

    const handleLogin = () =>{
        setMessage("Loading...");
        setModal(true);
        setLoading(true);
        if(logins.email !== "" ){
            axios.post(`${BASE_URL}/forget/password`,logins).then((result)=>{
                console.log(result.data);
                const datas = result.data;
                setMessage(datas.message);
                if(!datas.error){
                    setLoading(false);
                    setTimeout(()=>{
                        navigation.push("VerificationScreen",{
                            email: logins.email,
                            type: "forgot"
                        });
                        setModal(false);
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
  return (
    <SafeAreaView style={{
        ...tw`flex-grow w-full h-full bg-white p-5 pt-15`,
    }}>
      <ScrollView style={tw`h-full w-full ${Platform.OS == "ios" ? "p-5 pt-15" : "" }`}>
        <TouchableOpacity style={tw`w-12 p-2 border border-gray-400 rounded-lg`} onPress={()=>navigation.goBack()}>
            <Icon name='chevron-back' color={"#133A64"} size={26} />
        </TouchableOpacity>

            {/* Greetings */}
        <View style={tw`mt-[30px]`}>
            <Text style={tw`text-blue-800 text-[24px] font-medium`}>Forgot Password?</Text>
            <Text style={tw`text-gray-400 text-[14px] mt-[8px]`}>Input your email address to that field if you forgot your password..</Text>
        </View>

        {/* Forms */}
        <View style={tw`mt-[32px] w-full`}>
            <TextInput placeholder='Email' value={logins.email} onChangeText={(val)=>{
                setLogins({
                    ...logins,
                    email: val
                })
            }} keyboardType="email-address" style={tw`p-[16px] rounded-2xl border border-gray-200`} />
        </View>

        {/* Buttons */}
        <View style={tw`mt-5 w-full flex flex-col items-center`}>
            <PrimaryBtn title={"Continue"} onpressed={handleLogin} />
            <Text style={tw`mt-5`}>Or</Text>
            <TouchableOpacity onPress={()=>navigation.push("LoginScreen")} style={tw`w-full p-4 mt-[20px] border border-gray-300 items-center rounded-2xl`}>
                <Text style={{
                    ...tw`text-[16px] font-medium`,
                    color:'#133A64'
                }}>Sign In</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      
        <LoadingModal  visibility={modal} setVisibility={setModal} message={message} isloading={loading} />
    </SafeAreaView>
  )
}

export default ForgotPassword