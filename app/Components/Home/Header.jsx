import React,{ useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import Icon from "@expo/vector-icons/Ionicons"
import { StackActions, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { selectAccessToken, selectUserProfile, setRates, setUserProfile } from '../../config/redux/slice'
import LoadingModal from '../common/Modals/LoadingModal'
import { BASE_URL, GENERAL_URL, updatedevicetoken } from '../../config/api/Index'
import axios from 'axios'

const Header = () => {
  const [modal, setModal] = useState(false);
  const navigator = useNavigation();
  const userProfile = useSelector(selectUserProfile);
  const dispatch = useDispatch();
  const key = useSelector(selectAccessToken);

  const handleRefresh = () =>{
    setModal(true)
    getProfile(key);
    getRates();
    setTimeout(()=>{      
      setModal(false)
      navigator.dispatch(StackActions.replace("HomeScreen"))
    })
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
        updatedevicetoken(dataUser.email, key);
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
    <View style={tw`w-full flex flex-row items-center justify-between p-5`}>
      <TouchableOpacity style={tw`flex-1 flex flex-row`} onPress={()=>navigator.push("MoreScreen")}>
        <View>
          <Text style={tw`text-white text-[12px]`}>Welcome back!</Text>
          <Text style={tw`text-white font-medium text-[18px]`}>{userProfile?.fullname}</Text>  
        </View> 
        <TouchableOpacity onPress={handleRefresh}>
          <Icon name='reload-outline' color={"#ffffff"} size={20} style={tw`text-center p-2 ml-4`} />
        </TouchableOpacity>
      </TouchableOpacity>

      <TouchableOpacity style={tw`flex-1 items-end`} onPress={()=>navigator.push("NotificationScreen")}>
        <Icon name='notifications-outline' color={"#ffffff"} size={20} style={tw`border rounded-2xl text-center p-2 border-white w-[42px]`} />
      </TouchableOpacity>

      <LoadingModal message={"Loading..."} isloading={true} visibility={modal} setVisibility={setModal} />
    </View>
  )
}

export default Header