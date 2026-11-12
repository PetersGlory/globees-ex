import React, { useCallback } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import { BASE_URL, GENERAL_URL, PRIMARY_COLOR } from "@/hooks/api";
import {
  setAccessToken,
  setBtc,
  setRates,
  setUserProfile,
} from "@/hooks/redux/slice";
import SecondaryBtn from "@/components/common/SecondaryBtn";

const IntroScreen = () => {
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getToken();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const getToken = async () => {
    try {
      const accessToken: string | null =
        await AsyncStorage.getItem("accessToken");
      if (accessToken !== null && accessToken !== "") {
        dispatch(setAccessToken(accessToken));
        getProfile(accessToken);
        getRates();
        getCryptoAddress();
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.error(err);
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
        const dataUser = response.data.data;
        dispatch(setUserProfile(dataUser));
        updateToken(dataUser.email);
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

  // Getting crypto addresses
  const getCryptoAddress = () => {
    axios
      .request({ method: "GET", url: `${GENERAL_URL}/crypto_addresses` })
      .then((response) => {
        dispatch(setBtc(response.data.message));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateToken = async (email: string) => {
    const expoPushToken = await AsyncStorage.getItem("pushToken");
    if (!expoPushToken) {
      return;
    }
    axios
      .request({
        method: "POST",
        url: `${GENERAL_URL}/device_token`,
        data: { user_type: "user", token: expoPushToken, email },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: PRIMARY_COLOR }]}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Globees Ex logo"
        />
        <Text style={styles.title}>Globees Ex</Text>
        <Text style={styles.subtitle}>
          Swap or transfer fiat and crypto, and make cross-border payments in
          minutes.
        </Text>
      </View>

      <View style={styles.actions}>
        <SecondaryBtn
          title="Create Account"
          onpressed={() => router.push("RegistrationScreen" as never)}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("LoginScreen" as never)}
          style={({ pressed }) => [
            styles.secondaryBtn,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.secondaryBtnText}>Log in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24 },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: { width: 96, height: 96, marginBottom: 24 },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 320,
  },
  actions: { gap: 12, paddingBottom: 16 },
  primaryBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  pressed: { opacity: 0.85 },
});

export default IntroScreen;
