import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { usePushNotification } from "@/usePushNotification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from "react-redux";
import { store } from "@/hooks/redux/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { expoPushToken } = usePushNotification();
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    
    setPush();
  }, [loaded]);

  const setPush = async () => {
    if (expoPushToken?.data) {
      console.log(expoPushToken.data);
      await AsyncStorage.setItem("pushToken", expoPushToken.data);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "light" ? DefaultTheme : DarkTheme}>
      <Stack initialRouteName="index" screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" />
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="RegistrationScreen" />
        <Stack.Screen name="VerificationScreen" />
        <Stack.Screen name="IdentityVerify" />
        <Stack.Screen name="ForgotPassword" />
        <Stack.Screen name="AccountDetails" />
        <Stack.Screen name="AccountLimits" />
        <Stack.Screen name="ProfileScreen" />
        <Stack.Screen name="RewardsScreen" />
        <Stack.Screen name="InviteFriend" />
        <Stack.Screen name="NotificationScreen" />
        <Stack.Screen name="SummaryScreen" />
        <Stack.Screen name="CryptoSuccessPage" />
        <Stack.Screen name="ReceiverScreen" />
        <Stack.Screen name="TransactionScreen" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </Provider>
  );
}
