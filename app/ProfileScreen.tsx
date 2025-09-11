import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import tw from "twrnc";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { selectAccessToken, selectUserProfile } from "@/hooks/redux/slice";
import { usePushNotification } from "@/usePushNotification";
import { BASE_URL } from "@/hooks/api/Index";
import CustomHeader from "@/components/common/CustomHeader";
import LoadingModal from "@/components/common/Modals/LoadingModal";
import Icon from "@expo/vector-icons/Ionicons";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import CustomDropdown from "@/components/common/CustomDropdown";

const ProfileScreen = () => {
  const [selected, setSelected] = React.useState("");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const profileUser = useSelector(selectUserProfile);
  const key = useSelector(selectAccessToken);
  
  const gender = [
    { key: "2", value: "Male" },
    { key: "3", value: "Female" },
  ];
  
  const [regs, setRegs] = React.useState({
    fullname: "",
    phone: "+234",
    address: "",
    gender: "",
    country: "",
  });

  const { expoPushToken } = usePushNotification();

  useFocusEffect(
    useCallback(() => {
      const userCountry = getcountry();
      setRegs({
        fullname: profileUser?.fullname || "",
        phone: profileUser?.phone || "+234",
        address: profileUser?.address || "",
        gender: profileUser?.gender || "",
        country: userCountry as never || profileUser?.country || "",
      });
      setPush();
    }, [profileUser])
  );

  useEffect(() => {
    const userCountry = getcountry();
    setRegs({
      fullname: profileUser?.fullname || "",
      phone: profileUser?.phone || "+234",
      address: profileUser?.address || "",
      gender: profileUser?.gender || "",
      country: userCountry as never || profileUser?.country || "",
    });
    setPush();
  }, [profileUser]);

  const setPush = async () => {
    if (expoPushToken?.data) {
      await AsyncStorage.setItem("pushToken", expoPushToken.data);
    }
    console.log(regs.country)
  };

  const getcountry = async () =>{
    const countryUser = await AsyncStorage.getItem("userCountry");
    return countryUser;
  }

  const storeCountry = async (country:string) =>{
    await AsyncStorage.setItem("userCountry", country);
  }

  const handleUpdate = async () => {
    if (!regs.fullname.trim()) {
      Alert.alert("Error", "Full name is required");
      return;
    }

    setMessage("Updating profile...");
    setEnabled(true);
    setLoading(true);

    try {
      const result = await axios.request({
        method: "POST",
        url: `${BASE_URL}/update/profile`,
        data: regs,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
      });

      const datas = result.data;
      setMessage(datas.message);
      
      if (!datas.error) {
        setLoading(false);
        setIsEditing(false);
        storeCountry(regs.country);
        Alert.alert("Success", "Profile updated successfully!");
        setTimeout(() => {
          setEnabled(false);
        }, 2000);
      } else {
        Alert.alert("Error", datas.message || "Failed to update profile");
        setTimeout(() => {
          setEnabled(false);
          setLoading(false);
        }, 2000);
      }
    } catch (err: any) {
      setMessage(err.message || "Network error");
      Alert.alert("Error", "Failed to update profile. Please try again.");
      setTimeout(() => {
        setEnabled(false);
        setLoading(false);
      }, 2000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setRegs({
      fullname: profileUser?.fullname || "",
      phone: profileUser?.phone || "+234",
      address: profileUser?.address || "",
      gender: profileUser?.gender || "",
      country: getcountry() as never || profileUser?.country || "",
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView 
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-8`}
      >
        {/* Header Section */}
        <View style={tw`bg-white px-5 pt-3 pb-6`}>
          <CustomHeader title="Profile" />
          
          {/* Profile Avatar Section */}
          <View style={tw`items-center mt-4`}>
            <View style={tw`relative`}>
              <Image
                source={require("../assets/images/logo-bg.png")}
                style={tw`w-26 h-26 rounded-full border-4 border-blue-100`}
                alt="Profile Avatar"
              />
              {!isEditing && (
                <TouchableOpacity 
                  style={tw`absolute -bottom-2 -right-2 bg-blue-500 w-10 h-10 rounded-full items-center justify-center border-3 border-white shadow-lg`}
                  onPress={handleEdit}
                >
                  <Icon name="pencil" size={18} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={tw`text-2xl font-bold text-gray-900 mt-4 mb-1`}>
              {profileUser?.fullname || "User Profile"}
            </Text>
            <Text style={tw`text-gray-500 text-base mb-2`}>
              {profileUser?.email || "user@example.com"}
            </Text>
            
            {/* Verification Badge */}
            <View style={tw`${profileUser?.verified_user === "yes" ? 'bg-green-100' : 'bg-yellow-100'} px-4 py-2 rounded-full`}>
              <View style={tw`flex-row items-center`}>
                <Icon 
                  name={profileUser?.verified_user === "yes" ? "checkmark-circle" : "time"} 
                  size={16} 
                  color={profileUser?.verified_user === "yes" ? "#059669" : "#d97706"} 
                />
                <Text style={tw`${profileUser?.verified_user === "yes" ? 'text-green-700' : 'text-yellow-700'} font-semibold text-sm ml-2`}>
                  {profileUser?.verified_user === "yes" ? "Verified Account" : "Pending Verification"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Form Section */}
        <View style={tw`px-5`}>
          <View style={tw`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`}>
            {/* Form Header */}
            <View style={tw`bg-gray-100 p-4`}>
              <Text style={tw`text-gray-800 text-lg font-bold`}>Personal Information</Text>
              <Text style={tw`text-gray-500 text-sm mt-1`}>Update your profile details</Text>
            </View>
            
            {/* Form Fields */}
            <View style={tw`p-5 space-y-4`}>
              {/* Full Name */}
              <View>
                <Text style={tw`text-gray-700 font-semibold text-base mb-2 flex-row items-center`}>
                  <Icon name="person" size={16} color="#6b7280" style={tw`mr-2`} />
                  Full Name
                </Text>
                <TextInput
                  style={tw`border border-gray-200 rounded-xl p-4 text-gray-800 text-base bg-gray-50 ${isEditing ? 'border-blue-300 bg-white' : ''}`}
                  keyboardType="default"
                  onChangeText={(val) => setRegs({...regs, fullname: val})}
                  value={regs.fullname}
                  placeholder="Enter your full name"
                  editable={isEditing}
                />
              </View>

              {/* Phone Number */}
              <View>
                <Text style={tw`text-gray-700 font-semibold text-base mb-2 flex-row items-center`}>
                  <Icon name="call" size={16} color="#6b7280" style={tw`mr-2`} />
                  Mobile Number
                </Text>
                <TextInput
                  style={tw`border border-gray-200 rounded-xl p-4 text-gray-600 text-base bg-gray-100`}
                  keyboardType="phone-pad"
                  value={regs.phone}
                  placeholder="Phone number"
                  editable={false}
                />
                <Text style={tw`text-gray-400 text-xs mt-1 italic`}>Phone number cannot be changed</Text>
              </View>

              {/* Gender */}
              <View>
                <Text style={tw`text-gray-700 font-semibold text-base mb-2 flex-row items-center`}>
                  <Icon name="male-female" size={16} color="#6b7280" style={tw`mr-2`} />
                  Gender
                </Text>
                <SelectList
                  setSelected={(val: any) => {
                    setSelected(val);
                    setRegs({...regs, gender: val});
                  }}
                  data={gender}
                  save="value"
                  placeholder={regs.gender ? regs.gender : "Select gender"}
                  // disabled={!isEditing}
                  boxStyles={tw`border border-gray-200 rounded-xl p-4 bg-gray-50 ${isEditing ? 'border-blue-300 bg-white' : ''}`}
                  inputStyles={tw`text-gray-800 text-base`}
                  dropdownStyles={tw`border border-gray-200 rounded-xl bg-white shadow-lg`}
                  dropdownTextStyles={tw`text-gray-800 text-base`}
                />
              </View>

              {/* Country */}
              <View>
                <Text style={tw`text-gray-700 font-semibold text-base mb-2 flex-row items-center`}>
                  <Icon name="alert-circle" size={16} color="#6b7280" style={tw`mr-2`} />
                  Country
                </Text>
                <CustomDropdown placeholder={regs.country !== "" && regs.country !== null ? regs.country : "Select country"} onChange={(val)=> {
                  setRegs({...regs,country:val.name})}
                } />
                {/* <TextInput
                  style={tw`border border-gray-200 rounded-xl p-4 text-gray-800 text-base bg-gray-50 ${isEditing ? 'border-blue-300 bg-white' : ''}`}
                  onChangeText={(val) => setRegs({...regs, country: val})}
                  value={regs.country}
                  keyboardType="default"
                  placeholder="Enter country"
                  editable={isEditing}
                /> */}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {isEditing ? (
            <View style={tw`mt-6 space-y-3`}>
              <PrimaryBtn
                title={loading ? "Saving..." : "Save Changes"}
                onpressed={handleUpdate}
              />
            </View>
          ) : (
            <View style={tw`mt-6`}>
              <PrimaryBtn
                title={"Edit Profile"}
                onpressed={handleEdit}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <LoadingModal
        visibility={enabled}
        text={message}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;