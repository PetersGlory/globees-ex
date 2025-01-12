import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import { Platform } from "react-native";
import axios from "axios";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api/Index";
import { router } from "expo-router";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import LoadingModal from "@/components/common/Modals/LoadingModal";

const LoginScreen = () => {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("Loading....");
  const [logins, setLogins] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    referral: ""
  });

  const handleLogin = () => {
    setModal(true);
    setMessage("Loading...");
    setLoading(true);
    if (
      logins.fullname !== "" &&
      logins.phone !== "" &&
      logins.email !== "" &&
      logins.password !== ""
    ) {
      axios
        .post(`${BASE_URL}/registration`, logins)
        .then((result) => {
          console.log(result.data);
          const datas = result.data;
          setMessage(datas.message);
          if (!datas.error) {
            setLoading(false);
            setTimeout(() => {
             router.replace("/LoginScreen");
              setModal(false);
            }, 3000);
          } else {
            setTimeout(() => {
              // navigation.push("VerificationScreen");
              setModal(false);
              setLoading(false);
            }, 3000);
          }
        })
        .catch((err) => {
          console.log(err);
          setMessage(err.message);
          setTimeout(() => {
            // navigation.push("VerificationScreen");
            setModal(false);
            setLoading(false);
          }, 3000);
          console.log(err);
        });
    } else {
      setMessage("All fields are required.");
      setTimeout(() => {
        // navigation.push("VerificationScreen");
        setModal(false);
        setLoading(false);
      }, 3000);
    }
  };
  return (
    <SafeAreaView style={tw`flex-grow w-full h-full bg-white p-5 pt-10`}>
      <ScrollView
        style={tw`h-full w-full ${Platform.OS === "ios" ? "p-5 pt-10" : ""}`}
      >
        <TouchableOpacity
          style={tw`w-12 p-2 border border-gray-400 rounded-lg`}
          onPress={() => router.back()}
        >
          <Icon name="chevron-back" color={PRIMARY_COLOR} size={26} />
        </TouchableOpacity>

        {/* Greetings */}
        <View style={tw`mt-[20px]`}>
          <Text style={tw`text-[${PRIMARY_COLOR}] text-[24px] font-semibold`}>
            Create a Globees Ex account
          </Text>
        </View>

        {/* Forms */}
        <View style={tw`mt-[25px] w-full`}>
          <TextInput
            placeholder="Full Name"
            value={logins.fullname}
            onChangeText={(val) => {
              setLogins({
                ...logins,
                fullname: val,
              });
            }}
            keyboardType="default"
            style={tw`p-[16px] rounded-2xl border border-gray-200`}
          />
          <TextInput
            placeholder="Phone Number"
            value={logins.phone}
            onChangeText={(val) => {
              setLogins({
                ...logins,
                phone: val,
              });
            }}
            keyboardType="phone-pad"
            style={tw`p-[16px] rounded-2xl border border-gray-200 mt-5`}
          />
          <TextInput
            placeholder="Email"
            value={logins.email}
            onChangeText={(val) => {
              setLogins({
                ...logins,
                email: val,
              });
            }}
            keyboardType="email-address"
            style={tw`p-[16px] rounded-2xl border border-gray-200 mt-5`}
          />
          <TextInput
            placeholder="Password"
            value={logins.password}
            onChangeText={(val) => {
              setLogins({
                ...logins,
                password: val,
              });
            }}
            keyboardType="default"
            secureTextEntry={true}
            style={tw`p-[16px] rounded-2xl border border-gray-200 mt-5`}
          />
          <TextInput
            placeholder="Referral code (Optional)"
            value={logins.referral}
            onChangeText={(val) => {
              setLogins({
                ...logins,
                referral: val,
              });
            }}
            keyboardType="default"
            secureTextEntry={true}
            style={tw`p-[16px] rounded-2xl border border-gray-200 mt-5`}
          />
        </View>

        {/* Buttons */}
        <View style={tw`mt-8 w-full flex flex-col items-center`}>
          <PrimaryBtn title={"Sign Up"} onpressed={handleLogin} />
          <Text style={tw`mt-5`}>Or</Text>
          <TouchableOpacity
            onPress={() => router.push("/LoginScreen")}
            style={tw`w-full p-4 mt-[14px] border border-gray-300 items-center rounded-2xl`}
          >
            <Text
              style={{
                ...tw`text-[16px] font-medium`,
                color: PRIMARY_COLOR,
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={tw`w-full items-center justify-center flex flex-col`}>
        <LoadingModal
          visibility={modal}
          setVisibility={setModal}
          message={message}
          isloading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
