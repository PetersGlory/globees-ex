import React, { useState } from "react";
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
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api";
import LoadingModal from "@/components/common/Modals/LoadingModal";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const [focused, setFocused] = useState(false);
  const [logins, setLogins] = useState({ email: "" });

  const handleContinue = () => {
    setMessage("Loading...");
    setModal(true);
    setLoading(true);
    if (logins.email !== "") {
      axios
        .post(`${BASE_URL}/forget/password`, logins)
        .then((result) => {
          const datas = result.data;
          setMessage(datas.message);
          if (!datas.error) {
            setLoading(false);
            setTimeout(() => {
              router.push({
                pathname: "/VerificationScreen",
                params: { email: logins.email, type: "forgot" },
              });
              setModal(false);
            }, 3000);
          } else {
            setTimeout(() => {
              setModal(false);
              setLoading(false);
            }, 3000);
          }
        })
        .catch((err) => {
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
            Forgot password?
          </Text>
          <Text style={styles.subtitle}>
            Enter the email linked to your account and we'll send you a
            verification code.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={logins.email}
              onChangeText={(val) => setLogins({ ...logins, email: val })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="name@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.input, focused && { borderColor: PRIMARY_COLOR }]}
            />
          </View>

          <Pressable
            onPress={handleContinue}
            disabled={modal}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: PRIMARY_COLOR },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>Continue</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Remembered your password? </Text>
            <Pressable onPress={() => router.push("/LoginScreen")} hitSlop={8}>
              <Text style={[styles.link, { color: PRIMARY_COLOR }]}>
                Log in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingModal
        visibility={modal}
        setVisibility={setModal}
        message={message}
        isloading={loading}
      />
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
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
  },

  primaryBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  pressed: { opacity: 0.85 },

  link: { fontSize: 15, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 32,
  },
  footerText: { color: "#6b7280", fontSize: 15 },
});

export default ForgotPassword;
