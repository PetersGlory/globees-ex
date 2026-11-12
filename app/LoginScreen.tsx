import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as LocalAuthentication from "expo-local-authentication";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { BASE_URL, GENERAL_URL, PRIMARY_COLOR } from "@/hooks/api";
import { setAccessToken, setRates, setUserProfile } from "@/hooks/redux/slice";
import LoadingModal from "@/components/common/Modals/LoadingModal";

type Field = "email" | "password" | null;

const LoginScreen = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [fingerprint, setFingerprint] = useState(false);
  const [biometricType, setBiometricType] = useState<"face" | "fingerprint">(
    "fingerprint",
  );
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<Field>(null);
  const [logins, setLogins] = useState({ email: "", password: "" });
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      const enroll = await LocalAuthentication.isEnrolledAsync();
      if (enroll) {
        setFingerprint(true);
      }
      // Face ID / face unlock vs fingerprint
      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      const hasFace = types.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
      );
      const hasFinger = types.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT,
      );
      // If a device reports both (some Android phones), prefer fingerprint
      setBiometricType(hasFace && !hasFinger ? "face" : "fingerprint");
    })();
  }, []);

  const handleLogin = () => {
    setMessage("Loading...");
    setModal(true);
    if (logins.email !== "" && logins.password !== "") {
      axios
        .post(`${BASE_URL}/authenticate`, logins)
        .then((result) => {
          const datas = result.data;
          setMessage(datas.message);
          if (!datas.error) {
            setTimeout(() => {
              router.push({
                pathname: "VerificationScreen" as never,
                params: { email: logins.email },
              });
              setModal(false);
            }, 3000);
          } else {
            setTimeout(() => setModal(false), 3000);
          }
        })
        .catch((err) => {
          setMessage(err.message);
          setTimeout(() => setModal(false), 3000);
          console.log(err);
        });
    } else {
      setMessage("All fields are required.");
      setTimeout(() => setModal(false), 3000);
    }
  };

  const biometricLabel =
    biometricType === "face"
      ? Platform.OS === "ios"
        ? "Use Face ID"
        : "Use face unlock"
      : "Use fingerprint";

  const fingerPrintAuth = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: biometricLabel.replace("Use", "Log in with"),
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
      });
      if (biometricAuth.success) {
        setModal(true);
        getToken();
      }
    } catch (error) {
      setModal(false);
      console.log(error);
      alert("Session timeout, kindly login using your credentials.");
    }
  };

  const getToken = async () => {
    const accessToken: string | null =
      await AsyncStorage.getItem("accessTokenF");
    if (accessToken !== null && accessToken !== "") {
      dispatch(setAccessToken(accessToken));
      await AsyncStorage.setItem("accessToken", accessToken);
      getProfile(accessToken);
      getRates();
      setModal(false);
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1500);
    } else {
      alert("Session timeout, kindly login using your credentials.");
      setModal(false);
    }
  };

  // Getting profile
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
        dispatch(setUserProfile(response.data.data));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Getting rates
  const getRates = () => {
    axios
      .request({ method: "GET", url: `${GENERAL_URL}/rates` })
      .then((response) => {
        dispatch(setRates(response.data.message));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const inputStyle = (field: Field) => [
    styles.input,
    focused === field && { borderColor: PRIMARY_COLOR },
  ];

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

          <Text style={[styles.title, { color: PRIMARY_COLOR }]}>Log in</Text>
          <Text style={styles.subtitle}>
            Enter your email and password to continue.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={logins.email}
              onChangeText={(val) => setLogins({ ...logins, email: val })}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="name@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={inputStyle("email")}
            />

            <Text style={[styles.label, styles.labelSpaced]}>Password</Text>
            <View>
              <TextInput
                value={logins.password}
                onChangeText={(val) => setLogins({ ...logins, password: val })}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={[inputStyle("password"), styles.passwordInput]}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
                style={styles.eye}
              >
                <Icon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#6b7280"
                />
              </Pressable>
            </View>

            <Pressable
              onPress={() => router.push("ForgotPassword" as never)}
              hitSlop={8}
              style={styles.forgot}
            >
              <Text style={[styles.link, { color: PRIMARY_COLOR }]}>
                Forgot password?
              </Text>
            </Pressable>
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
            <Text style={styles.primaryBtnText}>Log in</Text>
          </Pressable>

          {isBiometricSupported && fingerprint && (
            <Pressable
              onPress={fingerPrintAuth}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.bioBtn,
                pressed && styles.pressed,
              ]}
            >
              <Icon
                name={
                  biometricType === "face"
                    ? "scan-outline"
                    : "finger-print-outline"
                }
                size={22}
                color={PRIMARY_COLOR}
              />
              <Text style={[styles.link, { color: PRIMARY_COLOR }]}>
                {biometricLabel}
              </Text>
            </Pressable>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable
              onPress={() => router.push("RegistrationScreen" as never)}
              hitSlop={8}
            >
              <Text style={[styles.link, { color: PRIMARY_COLOR }]}>
                Create account
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {modal && <LoadingModal visibility={modal} text={message} />}
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

  form: { marginTop: 32 },
  label: { color: "#374151", fontSize: 14, fontWeight: "600", marginBottom: 8 },
  labelSpaced: { marginTop: 20 },
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
  },
  passwordInput: { paddingRight: 48 },
  eye: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  forgot: { alignSelf: "flex-end", marginTop: 14 },
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

  bioBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 54,
    marginTop: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 32,
  },
  footerText: { color: "#6b7280", fontSize: 15 },
});

export default LoginScreen;
