import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  type TextInputInstance,
  type TextInputKeyPressEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch } from "react-redux";
import { StatusBar } from "expo-status-bar";
import {
  BASE_URL,
  GENERAL_URL,
  PRIMARY_COLOR,
  updatedevicetoken,
} from "@/hooks/api";
import { setAccessToken, setRates, setUserProfile } from "@/hooks/redux/slice";
import { router, useLocalSearchParams } from "expo-router";
import LoadingModal from "@/components/common/Modals/LoadingModal";

const CODE_LENGTH = 5;

const VerificationScreen = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("Verifying....");
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState<number | null>(null);
  const otpRefs = useRef<(TextInputInstance | null)[]>([]);
  const dispatch = useDispatch();

  const handleLogin = () => {
    setMessage("Loading...");
    setModal(true);
    setLoading(true);
    let datas = {
      email: params?.email,
      codes: code,
    };
    if (code !== "") {
      axios
        .post(`${BASE_URL}/verify/code`, datas)
        .then(async (result) => {
          const datas = result?.data;
          setMessage(datas.message);
          if (!datas.error) {
            setLoading(false);
            await AsyncStorage.setItem("accessToken", datas?.accessToken);
            dispatch(setAccessToken(datas?.accessToken));
            await AsyncStorage.setItem("accessTokenF", datas?.accessToken);
            getProfile(datas?.accessToken);
            getRates();
            if (typeof params?.email === "string") {
              updatedevicetoken(params.email, datas?.accessToken);
            }
            setModal(false);
            setTimeout(() => {
              router.replace("/(tabs)");
            }, 1500);
          } else {
            setTimeout(() => {
              setModal(false);
              setLoading(false);
            }, 3000);
          }
        })
        .catch((err: any) => {
          setMessage(err.message);
          setTimeout(() => {
            setModal(false);
            setLoading(false);
          }, 3000);
          console.log(err);
        });
    } else {
      setMessage("All fields are required.");
      setTimeout(() => {
        setModal(false);
        setLoading(false);
      }, 3000);
    }
  };

  // Getting Profile
  const getProfile = (key: string) => {
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
        let dataUser = response?.data?.data;
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
        let dataRate = response?.data?.message;
        dispatch(setRates(dataRate));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOtpChange = (value: string, index: number) => {
    const digits = value.replace(/\D/g, "");
    const next = code.split("");

    if (digits === "") {
      next[index] = "";
      setCode(next.join(""));
      return;
    }

    digits.split("").forEach((digit, offset) => {
      const pos = index + offset;
      if (pos < CODE_LENGTH) {
        next[pos] = digit;
      }
    });
    setCode(next.join("").slice(0, CODE_LENGTH));

    const focusIndex = Math.min(index + digits.length, CODE_LENGTH - 1);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleOtpKeyPress = (
    event: TextInputKeyPressEvent,
    index: number,
  ) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.back}
          >
            <Icon name="chevron-back" size={26} color={PRIMARY_COLOR} />
          </Pressable>

          <Text style={[styles.title, { color: PRIMARY_COLOR }]}>
            Verify your email
          </Text>
          <Text style={styles.subtitle}>
            We have sent a code to ( {params?.email} ). Enter it here to verify
            your identity.
          </Text>

          <View style={styles.form}>
            <View style={styles.otpRow}>
              {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                <TextInput
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  value={code[index] ?? ""}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(event) => handleOtpKeyPress(event, index)}
                  onFocus={() => setFocused(index)}
                  onBlur={() => setFocused(null)}
                  keyboardType="number-pad"
                  maxLength={CODE_LENGTH}
                  accessibilityLabel={`Digit ${index + 1}`}
                  style={[
                    styles.otpBox,
                    focused === index && { borderColor: PRIMARY_COLOR },
                  ]}
                />
              ))}
            </View>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>
                Haven't received email?{" "}
              </Text>
              <Pressable onPress={() => alert("Code Resent.")} hitSlop={8}>
                <Text style={[styles.link, { color: PRIMARY_COLOR }]}>
                  Send Email Again
                </Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={modal}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: PRIMARY_COLOR },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>Confirm</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingModal visibility={modal} text={message} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },

  back: { alignSelf: "flex-start", marginLeft: -4 },

  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 24,
  },
  subtitle: { color: "#6b7280", fontSize: 16, lineHeight: 24, marginTop: 8 },

  form: { marginTop: 36 },
  otpRow: { flexDirection: "row", gap: 10 },
  otpBox: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    textAlign: "center",
    textAlignVertical: "center",
    paddingVertical: 0,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  resendText: { color: "#6b7280", fontSize: 15 },
  link: { fontSize: 15, fontWeight: "600" },

  primaryBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  pressed: { opacity: 0.85 },
});

export default VerificationScreen;
