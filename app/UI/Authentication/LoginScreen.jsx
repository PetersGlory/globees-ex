import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Platform } from "react-native";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import PrimaryBtn from "../../Components/common/PrimaryBtn";
import LoadingModal from "../../Components/common/Modals/LoadingModal";
import axios from "axios";
import {
  BASE_URL,
  GENERAL_URL,
  PRIMARY_COLOR,
  sendpush,
} from "../../config/api/Index";
import * as LocalAuthentication from "expo-local-authentication";
import { useDispatch } from "react-redux";
import {
  setAccessToken,
  setRates,
  setUserProfile,
} from "../../config/redux/slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
// import { registerIndieID } from 'native-notify';

const LoginScreen = ({ navigation }) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [fingerprint, setFingerprint] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigation();
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("Loading....");
  const dispatch = useDispatch();
  const [logins, setLogins] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      const enroll = await LocalAuthentication.isEnrolledAsync();
      if (enroll) {
        setFingerprint(true);
      }
    })();
  }, []);

  const handleLogin = () => {
    setMessage("Loading...");
    setModal(true);
    setLoading(true);
    if (logins.email !== "" && logins.password !== "") {
      axios
        .post(`${BASE_URL}/authenticate`, logins)
        .then((result) => {
          console.log(result.data);
          const datas = result.data;
          setMessage(datas.message);
          if (!datas.error) {
            setLoading(false);
            setTimeout(() => {
              navigation.push("VerificationScreen", {
                email: logins.email,
              });
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

  const fingerPrintAuth = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with Biometrics",
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
      });
      if (biometricAuth.success) {
        setModal(true);
        // navigation.replace("Home");
        getToken();
        // alert("Success");
      }
    } catch (error) {
      setModal(false);
      console.log(error);
      alert("Session timeout, kindly login using your credentials.");
    }
  };

  const getToken = async () => {
    let accessToken = await AsyncStorage.getItem("accessTokenF");
    console.log(accessToken);
    if ((accessToken !== null) & (accessToken !== "")) {
      dispatch(setAccessToken(accessToken));
      await AsyncStorage.setItem("accessToken", accessToken);
      getProfile(accessToken);
      getRates();
      setModal(false);
      setTimeout(() => {
        navigator.dispatch(StackActions.replace("HomeScreen"));
      }, 1500);
    } else {
      alert("Session timeout, kindly login using your credentials.");
      setModal(false);
    }
  };

  // Getting Profile
  const getProfile = (key) => {
    axios
      .request({
        method: "GET",
        url: `${BASE_URL}/profile`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
      })
      .then((response) => {
        let dataUser = response.data.data;
        dispatch(setUserProfile(dataUser));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Getting Rates
  const getRates = () => {
    axios
      .request({
        method: "GET",
        url: `${GENERAL_URL}/rates`,
      })
      .then((response) => {
        let dataRate = response.data.message;
        dispatch(setRates(dataRate));
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <SafeAreaView
      style={{
        ...tw`flex-grow w-full h-full bg-white p-5 pt-15`,
      }}
    >
      <StatusBar style="dark" />
      <ScrollView
        style={tw`h-full w-full ${Platform.OS == "ios" ? "p-5 pt-15" : ""}`}
      >
        <TouchableOpacity
          style={tw`w-12 p-2 border border-gray-400 rounded-lg`}
          onPress={() => navigation.push("IntroScreen")}
        >
          <Icon name="chevron-back" color={PRIMARY_COLOR} size={26} />
        </TouchableOpacity>

        {/* Greetings */}
        <View style={tw`mt-[30px]`}>
          <Text
            style={{
              ...tw`text-[24px] font-medium`,
              color: PRIMARY_COLOR,
            }}
          >
            Hey There! 👋
          </Text>
          <Text style={tw`text-gray-400 text-[14px] mt-[8px]`}>
            Welcome to Globees Ex, Sign in to your account
          </Text>
        </View>

        {/* Forms */}
        <View style={tw`mt-[32px] w-full`}>
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
            style={tw`p-[16px] rounded-2xl border border-gray-200`}
          />
          <TextInput
            placeholder="Password"
            value={logins.password}
            secureTextEntry={true}
            onChangeText={(val) => {
              setLogins({
                ...logins,
                password: val,
              });
            }}
            keyboardType="default"
            style={tw`p-[16px] rounded-2xl border border-gray-200 mt-5`}
          />

          <TouchableOpacity
            onPress={() => navigation.push("ForgotPassword")}
            style={tw`mt-[15px]`}
          >
            <Text
              style={{
                ...tw`text-[16px] font-medium`,
                color: PRIMARY_COLOR,
              }}
            >
              Forget Password ?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={tw`mt-5 w-full flex flex-col items-center`}>
          <PrimaryBtn title={"Sign In"} onpressed={handleLogin} />
          <Text style={tw`mt-3`}>Or</Text>
          <TouchableOpacity
            onPress={() => navigation.push("RegistrationScreen")}
            style={tw`w-full p-4 mt-[12px] border border-gray-300 items-center rounded-2xl`}
          >
            <Text
              style={{
                ...tw`text-[16px] font-medium`,
                color: PRIMARY_COLOR,
              }}
            >
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
        {/* Buttons */}
        <View style={tw`mt-3 w-full flex flex-col items-center pt-5`}>
          <Text style={tw`text-center text-[13px] text-gray-700`}>
            Fingerprint
          </Text>
          {isBiometricSupported && fingerprint ? (
            <TouchableOpacity
              onPress={fingerPrintAuth}
              style={tw`w-full mt-2 p-4 items-center rounded-2xl`}
            >
              <Icon
                name="finger-print-outline"
                size={30}
                style={tw`text-blue-900`}
              />
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={tw`text-center text-[13px] text-gray-700`}>
                Fingerprint not supported.
              </Text>
            </View>
          )}
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
