import React,{ useState,useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, SafeAreaView } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list';
import tw from "twrnc"
import CustomHeader from '../Components/common/CustomHeader'
import PrimaryBtn from '../Components/common/PrimaryBtn';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { selectAccessToken, selectUserProfile } from '../config/redux/slice';
import LoadingModal from '../Components/common/Modals/LoadingModal';
import { BASE_URL, sendpush } from '../config/api/Index';
import axios from 'axios';

const ProfileScreen = () => {
    const [selected, setSelected] = React.useState("");
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("")
    const profileUser = useSelector(selectUserProfile)
    const key = useSelector(selectAccessToken);
    const gender = [
        {key:'2', value:'Male'},
        {key:'3', value:'Female'},
    ]
    const [regs, setRegs] = React.useState({
        fullname: "",
        phone: "+234",
        address: "",
        gender: ""
    })

    useEffect(()=>{
        setRegs({
            fullname: profileUser?.fullname,
            phone: profileUser?.phone,
            address: profileUser?.address,
            gender: profileUser?.gender
        })
        // allsubs();
    },[])

    const handleUpdate = () =>{
        setMessage("Loading...");
        setEnabled(true);
        setLoading(true);

        axios.request({
            method: "POST",
            url: `${BASE_URL}/update/profile`,
            data:regs,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: 'Bearer '+key
            }
        }).then((result)=>{
            console.log(result.data);
            const datas = result.data;
            setMessage(datas.message);
            if(!datas.error){
                setLoading(false);
                setTimeout(()=>{
                    setEnabled(false);
                }, 3000);
                sendpush('Profile Updated',`${regs.fullname} you just updated your profile information`,key);
            }else{
                setTimeout(()=>{
                    setEnabled(false);
                    setLoading(false);
                }, 3000);
            }
        }).catch((err) => {
            setMessage(err.message);
            setTimeout(()=>{
                setEnabled(false);
                setLoading(false);
            }, 3000);
            console.log(err);
        })
    }

    // const allsubs = async () =>{        
    //     let response = await axios.get(`https://app.nativenotify.com/api/expo/indie/subs/14312/NRKYt9PycbIzkLWoNHDK1o`);
    //     console.log(response.data)
    // }
  return (
    <SafeAreaView style={tw`flex-grow p-5 pt-10 bg-white h-full`}>

        {/* User Information */}
        <ScrollView style={tw`w-full bg-white h-[55%] rounded-lg ${Platform.OS == "ios" ? "pl-5 pr-5" : ""}`}>
        <CustomHeader title={"Profile"} />

        {/* Image */}
        <TouchableOpacity style={tw`mt-2 justify-center items-center`}>
            <Image source={require('../../assets/img/logo_dark.png')} style={{
                ...tw`rounded-full`,
                width: 100,
                height: 100
            }} alt='Avarter' />
        </TouchableOpacity>
            {/* fullname Input */}
            <View>
                <Text style={tw`text-gray-700`}>Full Name</Text>
                <TextInput style={tw`border border-gray-300 mt-2 rounded-lg p-3 text-gray-600`} keyboardType='default' onChangeText={(val) =>{
                    setRegs({
                        ...regs,
                        fullname: val
                    })
                }} value={regs.fullname} placeholder='E.g John' />
            </View>
            {/* phone Input */}
            <View style={tw`mt-5`}>
                <Text style={tw`text-gray-700`}>Mobile Number</Text>
                <TextInput editable={false} style={tw`border border-gray-300 mt-2 rounded-lg p-3 text-gray-600`} keyboardType='phone-pad' onChangeText={(val) =>{
                    setRegs({
                        ...regs,
                        phone: val
                    })
                }} value={regs.phone} placeholder='E.g +234--' />
            </View>
            {/* Gender */}            
            <View style={tw`mt-5`}>
                <Text style={tw`text-gray-700`}>Gender</Text>                
                <SelectList 
                        setSelected={(val) => {
                            setSelected(val);
                            setRegs({
                                ...regs,
                                gender: val
                            })
                        }}
                        data={gender}
                        save='value'
                    />
            </View>
            {/* Address Input */}
            <View style={tw`mt-5`}>
                <Text style={tw`text-gray-700`}>Country</Text>
                <TextInput style={tw`border border-gray-300 mt-2 rounded-lg p-3 text-gray-600`} onChangeText={(val) =>{
                    setRegs({
                        ...regs,
                        address: val
                    })
                }} value={regs.address} keyboardType='default' placeholder='E.g UK' />
            </View>

            <View style={tw`w-full mt-5`}>
                <PrimaryBtn title={"Update"} onpressed={handleUpdate} />
            </View>
        </ScrollView>
        <LoadingModal visibility={enabled} isloading={loading} setVisibility={setEnabled} message={message} />
    </SafeAreaView>
  )
}

export default ProfileScreen