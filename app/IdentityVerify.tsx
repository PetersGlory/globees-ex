import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  TextInput,
} from "react-native";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import { SelectList } from "react-native-dropdown-select-list";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectAccessToken } from "@/hooks/redux/slice";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api/Index";
import { router } from "expo-router";
import SecondaryBtn from "@/components/common/SecondaryBtn";
import LoadingModal from "@/components/common/Modals/LoadingModal";

const IdentityVerify = () => {
  const accessToken = useSelector(selectAccessToken);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Validating....");
  const [identity, setIdentity] = useState({
    id_number: "",
    id_type: "",
    first_name: "",
    last_name: "",
    dob: "",
  });

  const datas = [
    // {key:'1', value:'BVN'},
    { key: "2", value: "NIN" },
    // {key:'3', value:'Voters Card'},
    { key: "4", value: "Nigerian Passport" },
    { key: "5", value: "Drivers License" },
    // {key:'5', value:'ETH'},
  ];

  const handleValidate = async () => {
    setModal(true);
    setLoading(true);
    if (
      identity.id_number !== "" &&
      identity.dob !== "" &&
      identity.first_name !== "" &&
      identity.last_name !== "" &&
      identity.id_type !== ""
    ) {
      axios
        .request({
          method: "POST",
          url: `${BASE_URL}/validate-identity`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          data: identity,
        })
        .then((response) => {
          const datas = response?.data;
          setMessage(datas.message);
          if (!datas.error) {
            setLoading(false);
            setTimeout(() => {
              setModal(false);
              router.back();
            }, 1500);
          }

          setTimeout(() => {
            setIdentity({
              id_number: "",
              id_type: "",
              first_name: "",
              last_name: "",
              dob: "",
            });
            setModal(false);
            setLoading(false);
          }, 3000);
        })
        .catch((err) => {
          setMessage(err.response.data.message);
          setTimeout(() => {
            setModal(false);
            setLoading(false);
          }, 3000);
          console.error(err.response.data);
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
    <SafeAreaView
      style={tw`flex-grow w-full h-full bg-[${PRIMARY_COLOR}] p-5 pt-15`}
    >
      <StatusBar style="light" translucent={true} />
      <ScrollView
        style={tw`h-full w-full ${Platform.OS == "ios" ? " p-5 pt-15" : ""}`}
      >
        <TouchableOpacity
          style={tw`w-12 p-2 border border-gray-400 rounded-lg`}
          onPress={() => router.back()}
        >
          <Icon name="chevron-back" color={"#ffffff"} size={26} />
        </TouchableOpacity>

        {/* Greetings */}
        <View style={tw`mt-[20px] items-center`}>
          <Text
            style={{
              ...tw`text-[24px] font-medium`,
              color: PRIMARY_COLOR,
            }}
          >
            <Icon name="id-card-outline" color={"#ffffff"} size={50} />
          </Text>
          <Text
            style={tw`text-gray-100 text-[25px] font-bold mt-[8px] capitalize`}
          >
            verify your identity.
          </Text>
        </View>

        {/* Form */}

        <View style={tw`mt-[15px] w-full`}>
          <SelectList
            setSelected={(val:any) => {
              setIdentity({
                ...identity,
                id_type: val,
              });
            }}
            placeholder="Choose Identity Type"
            boxStyles={tw`p-[14px] mt-4 rounded-2xl border border-gray-200 text-gray-200 bg-white`}
            dropdownTextStyles={tw`text-gray-200`}
            data={datas}
            save="value"
          />
          <TextInput
            placeholder="Identity Number"
            value={identity.id_number}
            onChangeText={(val) => {
              setIdentity({
                ...identity,
                id_number: val,
              });
            }}
            keyboardType="default"
            style={tw`p-[14px] mt-4 rounded-2xl border border-gray-200 text-gray-200`}
            placeholderTextColor={"#fbfcfb"}
          />
          <TextInput
            placeholder="First Name"
            value={identity.first_name}
            onChangeText={(val) => {
              setIdentity({
                ...identity,
                first_name: val,
              });
            }}
            keyboardType="default"
            style={tw`p-[14px] mt-4 rounded-2xl border border-gray-200 text-gray-200`}
            placeholderTextColor={"#fbfcfb"}
          />
          <TextInput
            placeholder="Last Name"
            value={identity.last_name}
            onChangeText={(val) => {
              setIdentity({
                ...identity,
                last_name: val,
              });
            }}
            keyboardType="default"
            style={tw`p-[14px] mt-4 rounded-2xl border border-gray-200 text-gray-200`}
            placeholderTextColor={"#fbfcfb"}
          />
          <TextInput
            placeholder="Date of birth: (YYYY-MM-DD)"
            value={identity.dob}
            onChangeText={(val) => {
              setIdentity({
                ...identity,
                dob: val,
              });
            }}
            keyboardType="default"
            style={tw`p-[14px] mt-4 rounded-2xl border border-gray-200 text-gray-200`}
            placeholderTextColor={"#fbfcfb"}
          />
        </View>
        {/* Buttons */}
        <View style={tw`mt-5 w-full flex flex-col items-center`}>
          <SecondaryBtn title={"Validate >"} onpressed={handleValidate} />
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

export default IdentityVerify;
