import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Vibration,
} from "react-native";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import { SelectList } from "react-native-dropdown-select-list";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectAccessToken } from "@/hooks/redux/slice";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api/Index";
import { router } from "expo-router";
import LoadingModal from "@/components/common/Modals/LoadingModal";

const { width, height } = Dimensions.get('window');

const IdentityVerify = () => {
  const accessToken = useSelector(selectAccessToken);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Validating....");
  const [currentStep, setCurrentStep] = useState(0);
  const [identity, setIdentity] = useState({
    id_number: "",
    id_type: "",
    first_name: "",
    last_name: "",
    dob: "",
  });

  // Advanced animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const datas = [
    { key: "2", value: "NIN", icon: "finger-print", color: "#3b82f6" },
    { key: "4", value: "Nigerian Passport", icon: "passport", color: "#10b981" },
    { key: "5", value: "Drivers License", icon: "car", color: "#f59e0b" },
  ];

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for hero section
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animateProgress = (step: number) => {
    Animated.timing(progressAnim, {
      toValue: step,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const handleFieldChange = (field: string, value: string) => {
    setIdentity(prev => ({ ...prev, [field]: value }));
    
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    
    // Animate progress
    const filledFields = Object.values(identity).filter(val => val !== "").length;
    animateProgress(filledFields / 5);
  };

  const handleValidate = async () => {
    if (Object.values(identity).some(val => val === "")) {
      Alert.alert("Incomplete Form", "Please fill in all fields to continue.");
      return;
    }

    setModal(true);
    setLoading(true);
    setMessage("🔍 Validating your identity...");

    try {
      const response = await axios.request({
        method: "POST",
        url: `${BASE_URL}/validate-identity`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        data: identity,
      });

      const datas = response?.data;
      setMessage(datas.message);
      
      if (!datas.error) {
        setLoading(false);
        setMessage("✅ Identity verified successfully!");
        
        // Success animation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        setTimeout(() => {
          setModal(false);
          router.back();
        }, 2000);
      } else {
        setMessage(`❌ ${datas.message || "Verification failed"}`);
        setTimeout(() => {
          setModal(false);
          setLoading(false);
        }, 3000);
      }
    } catch (err: any) {
      setMessage(`⚠️ ${err.response?.data?.message || "Network error"}`);
      setTimeout(() => {
        setModal(false);
        setLoading(false);
      }, 3000);
    }
  };

  const resetForm = () => {
    setIdentity({
      id_number: "",
      id_type: "",
      first_name: "",
      last_name: "",
      dob: "",
    });
    animateProgress(0);
    
    // Reset animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getFieldStatus = (field: string) => {
    const value = identity[field as keyof typeof identity];
    if (value === "") return "empty";
    if (field === "dob" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "invalid";
    return "valid";
  };

  const renderFieldIcon = (field: string) => {
    const status = getFieldStatus(field);
    const icons = {
      empty: "ellipse-outline",
      valid: "checkmark-circle",
      invalid: "close-circle",
    };
    const colors = {
      empty: "#9ca3af",
      valid: "#10b981",
      invalid: "#ef4444",
    };
    
    return (
      <Icon 
        name={icons[status] as never} 
        size={20} 
        color={colors[status]} 
        style={tw`absolute right-3 top-4`}
      />
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[${PRIMARY_COLOR}] py-10`}>
      <StatusBar style="light" />
      
      {/* Animated Background Elements */}
      <View style={tw`absolute inset-0`}>
        <View style={tw`absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl`} />
        <View style={tw`absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl`} />
        <View style={tw`absolute bottom-40 left-20 w-24 h-24 bg-green-500/20 rounded-full blur-xl`} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        {/* Advanced Header */}
        <Animated.View 
          style={[
            tw`px-5 pt-3 pb-6`,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={tw`flex-row items-center justify-between`}>
            <TouchableOpacity
              style={tw`w-12 h-12 bg-white/10 backdrop-blur-lg rounded-2xl items-center justify-center border border-white/20`}
              onPress={() => router.back()}
            >
              <Icon name="chevron-back" color="#ffffff" size={24} />
            </TouchableOpacity>
            
            <View style={tw`items-center`}>
              <Text style={tw`text-white text-xl font-bold`}>Identity Verification</Text>
              <Text style={tw`text-blue-200 text-sm`}>Secure & Private</Text>
            </View>
            
            <TouchableOpacity
              style={tw`w-12 h-12 bg-white/10 backdrop-blur-lg rounded-2xl items-center justify-center border border-white/20`}
              onPress={resetForm}
            >
              <Icon name="refresh" color="#ffffff" size={20} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView 
          style={tw`flex-1`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-8`}
        >
          {/* Progress Indicator */}
          <Animated.View style={tw`px-5 mb-6`}>
            <View style={tw`bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20`}>
              <View style={tw`flex-row items-center justify-between mb-2`}>
                <Text style={tw`text-white font-semibold`}>Form Progress</Text>
                <Text style={tw`text-blue-200 `}>
                  {Math.round((Object.values(identity).filter(val => val !== "").length / 5) * 100)}%
                </Text>
              </View>
              <View style={tw`bg-white/20 rounded-full h-2 overflow-hidden`}>
                <Animated.View 
                  style={[
                    tw`bg-[${PRIMARY_COLOR}] h-2 rounded-full`,
                    { width: progressAnim.interpolate({
                      inputRange: [0, 5],
                      outputRange: ['0%', '100%']
                    })}
                  ]}
                />
              </View>
            </View>
          </Animated.View>

          {/* Hero Section with 3D Effect */}
          <Animated.View 
            style={[
              tw`px-5 mb-8`,
              { 
                opacity: fadeAnim, 
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ] 
              }
            ]}
          >
            <View style={tw`bg-[${PRIMARY_COLOR}] rounded-3xl p-8 -2xl border border-white/20 overflow-hidden`}>
              {/* Floating Elements */}
              <View style={tw`absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full blur-sm`} />
              <View style={tw`absolute bottom-4 left-4 w-12 h-12 bg-white/20 rounded-full blur-sm`} />
              
              <Animated.View 
                style={[
                  tw`items-center`,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <View style={tw`bg-white/20 w-24 h-24 rounded-full items-center justify-center mb-6 backdrop-blur-lg border border-white/30`}>
                  <Icon name="shield-checkmark" color="#ffffff" size={50} />
                </View>
                <Text style={tw`text-white text-2xl font-bold text-center mb-3`}>
                  Verify Your Identity
                </Text>
                <Text style={tw`text-blue-100 text-center`}>
                  Complete the verification process to unlock premium features and enhanced security
                </Text>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Advanced Form Section */}
          <Animated.View 
            style={[
              tw`px-5`,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={tw`bg-white/10 backdrop-blur-lg rounded-3xl -2xl border border-white/20 overflow-hidden`}>
              {/* Form Header */}
              <View style={tw`bg-white/10 p-6 border-b border-white/20`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-10 h-10 bg-[${PRIMARY_COLOR}] rounded-full items-center justify-center mr-3`}>
                    <Icon name="document-text" size={20} color="#ffffff" />
                  </View>
                  <View>
                    <Text style={tw`text-white text-lg font-bold`}>Identity Information</Text>
                    <Text style={tw`text-blue-200 text-[11px]`}>Provide your official identification details</Text>
                  </View>
                </View>
              </View>
              
              {/* Form Fields */}
              <View style={tw`p-6 space-y-6`}>
                {/* Identity Type with Enhanced SelectList */}
                <View>
                  <Text style={tw`text-white font-semibold text-base mb-3 flex-row items-center`}>
                    <Icon name="card" size={18} color="#60a5fa" style={tw`mr-2`} />
                    Identity Type
                  </Text>
                  <SelectList
                    setSelected={(val: any) => handleFieldChange("id_type", val)}
                    placeholder="Choose Identity Type"
                    boxStyles={tw`border border-white/20 rounded-2xl p-4 bg-white/10 mb-2`}
                    inputStyles={tw`text-white text-base`}
                    dropdownStyles={tw`border border-white/20 rounded-2xl bg-slate-800/95`}
                    dropdownTextStyles={tw`text-white text-base`}
                    data={datas}
                    save="value"
                    // placeholderTextColor="#9ca3af"
                  />
                </View>

                {/* Identity Number */}
                <View>
                  <Text style={tw`text-white font-semibold text-base mb-3 flex-row items-center`}>
                    <Icon name="finger-print" size={18} color="#60a5fa" style={tw`mr-2`} />
                    Identity Number
                  </Text>
                  <View style={tw`relative`}>
                    <TextInput
                      placeholder="Enter your identity number"
                      value={identity.id_number}
                      onChangeText={(val) => handleFieldChange("id_number", val)}
                      keyboardType="default"
                      style={tw`border border-white/20 rounded-2xl p-4 text-white text-base bg-white/10 mb-2 pr-12`}
                      placeholderTextColor="#9ca3af"
                    />
                    {renderFieldIcon("id_number")}
                  </View>
                </View>

                {/* First Name */}
                <View>
                  <Text style={tw`text-white font-semibold text-base mb-3 flex-row items-center`}>
                    <Icon name="person" size={18} color="#60a5fa" style={tw`mr-2`} />
                    First Name
                  </Text>
                  <View style={tw`relative`}>
                    <TextInput
                      placeholder="Enter your first name"
                      value={identity.first_name}
                      onChangeText={(val) => handleFieldChange("first_name", val)}
                      keyboardType="default"
                      style={tw`border border-white/20 rounded-2xl p-4 text-white text-base bg-white/10 mb-2 pr-12`}
                      placeholderTextColor="#9ca3af"
                    />
                    {renderFieldIcon("first_name")}
                  </View>
                </View>

                {/* Last Name */}
                <View>
                  <Text style={tw`text-white font-semibold text-base mb-3 flex-row items-center`}>
                    <Icon name="person" size={18} color="#60a5fa" style={tw`mr-2`} />
                    Last Name
                  </Text>
                  <View style={tw`relative`}>
                    <TextInput
                      placeholder="Enter your last name"
                      value={identity.last_name}
                      onChangeText={(val) => handleFieldChange("last_name", val)}
                      keyboardType="default"
                      style={tw`border border-white/20 rounded-2xl p-4 text-white text-base bg-white/10 mb-2 pr-12`}
                      placeholderTextColor="#9ca3af"
                    />
                    {renderFieldIcon("last_name")}
                  </View>
                </View>

                {/* Date of Birth */}
                <View>
                  <Text style={tw`text-white font-semibold text-base mb-3 flex-row items-center`}>
                    <Icon name="calendar" size={18} color="#60a5fa" style={tw`mr-2`} />
                    Date of Birth
                  </Text>
                  <View style={tw`relative`}>
                    <TextInput
                      placeholder="YYYY-MM-DD (e.g., 1990-01-01)"
                      value={identity.dob}
                      onChangeText={(val) => handleFieldChange("dob", val)}
                      keyboardType="default"
                      style={tw`border border-white/20 rounded-2xl p-4 text-white text-base bg-white/10 mb-2 pr-12`}
                      placeholderTextColor="#9ca3af"
                    />
                    {renderFieldIcon("dob")}
                  </View>
                  <Text style={tw`text-blue-200 text-xs mt-2 italic`}>
                    Format: YYYY-MM-DD
                  </Text>
                </View>
              </View>
            </View>

            {/* Advanced Action Button */}
            <View style={tw`mt-8`}>
              <TouchableOpacity
                style={tw`bg-[${PRIMARY_COLOR}] py-5 rounded-2xl -2xl border border-white/20 overflow-hidden`}
                onPress={handleValidate}
                disabled={loading}
              >
                {/* Button Background Animation */}
                <View style={tw`absolute inset-0 bg-[${PRIMARY_COLOR}] opacity-0`} />
                
                <View style={tw`flex-row items-center justify-center`}>
                  <Icon name="shield-checkmark" size={24} color="#ffffff" style={tw`mr-3`} />
                  <Text style={tw`text-white font-bold text-xl`}>
                    {loading ? "Verifying..." : "Verify Identity"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Enhanced Info Section */}
            <View style={tw`mt-8 bg-[${PRIMARY_COLOR}]/20 rounded-3xl p-6 border border-white/20`}>
              <View style={tw`flex-col items-center`}>
                <View style={tw`w-12 h-12 mb-4 bg-white bg-opacity-30 rounded-full items-center justify-center mr-4`}>
                  <Icon name="information-circle" size={28} color="#60a5fa" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-white font-extrabold text-lg mb-2`}>
                    How Identity Verification Works
                  </Text>
                  <Text style={tw`text-blue-100 text-xs leading-6 mb-2`}>
                    We use advanced AI-powered systems to securely verify your identity against official records. This process is designed to protect your account and the community.
                  </Text>
                  <View style={tw`flex-row items-center mb-1`}>
                    <Icon name="time-outline" size={15} color="#fbbf24" style={tw`mr-2`} />
                    <Text style={tw`text-yellow-200 text-xs`}>Usually completed in 24-48 hours</Text>
                  </View>
                  <View style={tw`flex-row items-center mb-1`}>
                    <Icon name="notifications" size={15} color="#60a5fa" style={tw`mr-2`} />
                    <Text style={tw`text-blue-200 text-xs`}>Get real-time status updates</Text>
                  </View>
                  <View style={tw`flex-row items-center mb-1`}>
                    <Icon name="person-circle" size={15} color="#a5b4fc" style={tw`mr-2`} />
                    <Text style={tw`text-indigo-200 text-xs`}>Only you can access your data</Text>
                  </View>
                  {/* Security Features */}
                  <View style={tw`mt-3 flex-row flex-wrap items-center`}>
                    <View style={tw`flex-row items-center mr-4 mb-1`}>
                      <Icon name="lock-closed" size={16} color="#10b981" style={tw`mr-1`} />
                      <Text style={tw`text-green-300 text-xs`}>End-to-end encrypted</Text>
                    </View>
                    <View style={tw`flex-row items-center mr-4 mb-1`}>
                      <Icon name="shield-checkmark" size={16} color="#10b981" style={tw`mr-1`} />
                      <Text style={tw`text-green-300 text-xs`}>GDPR compliant</Text>
                    </View>
                    <View style={tw`flex-row items-center mb-1`}>
                      <Icon name="eye-off" size={16} color="#f472b6" style={tw`mr-1`} />
                      <Text style={tw`text-pink-200 text-xs`}>Private & confidential</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingModal
        visibility={modal}
        text={message}
      />
    </SafeAreaView>
  );
};

export default IdentityVerify;