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
  TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api";
import LoadingModal from "@/components/common/Modals/LoadingModal";

type FieldProps = TextInputProps & {
  label: string;
  right?: React.ReactNode;
};

// Defined outside the screen so inputs keep focus while typing
const Field = ({ label, right, style, ...props }: FieldProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor="#9ca3af"
          style={[
            styles.input,
            focused && { borderColor: PRIMARY_COLOR },
            right ? styles.inputWithIcon : null,
            style,
          ]}
        />
        {right}
      </View>
    </View>
  );
};

const RegistrationScreen = () => {
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const [showPassword, setShowPassword] = useState(false);
  const [logins, setLogins] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    referral: "",
  });

  const update = (key: keyof typeof logins) => (val: string) =>
    setLogins((prev) => ({ ...prev, [key]: val }));

  const handleRegister = () => {
    setModal(true);
    setMessage("Loading...");
    if (
      logins.fullname !== "" &&
      logins.phone !== "" &&
      logins.email !== "" &&
      logins.password !== ""
    ) {
      axios
        .post(`${BASE_URL}/registration`, logins)
        .then((result) => {
          const datas = result.data;
          setMessage(datas.message);
          if (!datas.error) {
            setTimeout(() => {
              router.replace("/LoginScreen");
              setModal(false);
            }, 3000);
          } else {
            setTimeout(() => setModal(false), 3000);
          }
        })
        .catch((err) => {
          console.log(err);
          setMessage(err.message);
          setTimeout(() => setModal(false), 3000);
        });
    } else {
      setMessage("All fields are required.");
      setTimeout(() => setModal(false), 3000);
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
            Create account
          </Text>
          <Text style={styles.subtitle}>
            Fill in your details to get started.
          </Text>

          <View style={styles.form}>
            <Field
              label="Full name"
              value={logins.fullname}
              onChangeText={update("fullname")}
              placeholder="Your full name"
              autoCapitalize="words"
            />
            <Field
              label="Phone number"
              value={logins.phone}
              onChangeText={update("phone")}
              placeholder="Your phone number"
              keyboardType="phone-pad"
            />
            <Field
              label="Email"
              value={logins.email}
              onChangeText={update("email")}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Field
              label="Password"
              value={logins.password}
              onChangeText={update("password")}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              right={
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
              }
            />
            <Field
              label="Referral code (optional)"
              value={logins.referral}
              onChangeText={update("referral")}
              placeholder="Enter a referral code"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Pressable
            onPress={handleRegister}
            disabled={modal}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: PRIMARY_COLOR },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>Create account</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/LoginScreen")} hitSlop={8}>
              <Text style={[styles.link, { color: PRIMARY_COLOR }]}>
                Log in
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

  form: { marginTop: 28 },
  field: { marginBottom: 20 },
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
  inputWithIcon: { paddingRight: 48 },
  eye: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },

  primaryBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
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

export default RegistrationScreen;
