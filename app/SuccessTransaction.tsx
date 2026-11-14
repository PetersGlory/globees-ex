import React, { useEffect, useRef } from "react";
import {
  Animated,
  BackHandler,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { selectExchange } from "@/hooks/redux/slice";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import { AmountFormatter } from "@/hooks/lib/formatter";

interface ExchangeState {
  to?: string;
  selectedC?: string;
}

const getAmountText = (type?: string, exchange?: ExchangeState | null) => {
  if (!exchange?.to) return null;
  if (type !== "payment") return exchange.to;
  const symbol =
    exchange.selectedC === "NGN"
      ? "₦"
      : exchange.selectedC === "EUR"
        ? "£"
        : "$";
  return `${symbol}${exchange.to}`;
};

const SuccessTransaction = () => {
  const params = useLocalSearchParams<{ category?: string }>();
  const exchange = useSelector(selectExchange) as ExchangeState | null;
  const type = params.category;

  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const goHome = () => router.replace("/(tabs)");

  const goToHistory = () => {
    router.replace("/(tabs)");
    router.push("TransactionScreen" as never);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        goHome();
        return true;
      },
    );
    return () => subscription.remove();
  }, []);

  const amountText = getAmountText(type, exchange);

  const message =
    type === "exchange"
      ? "Your exchange will arrive in minutes. Thank you for your business with Globees Ex! We look forward to connecting with you again."
      : "Your payment will be processed in minutes.";

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar style="dark" />

      <View style={tw`flex-row justify-end px-5 pt-3`}>
        <TouchableOpacity
          onPress={goHome}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Icon name="close" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View style={tw`flex-1 items-center justify-center px-8`}>
        <Animated.View
          style={{ alignItems: "center", opacity, transform: [{ scale }] }}
        >
          <Image
            source={require("../assets/images/success-bg.png")}
            style={{ width: 180, height: 180 }}
            resizeMode="contain"
            accessibilityLabel="Transfer submitted"
          />

          <View
            style={[
              tw`flex-row items-center rounded-full px-3 py-1.5 mt-6`,
              { backgroundColor: "#FFFBEB" },
            ]}
          >
            <Icon name="time-outline" size={14} color="#B45309" />
            <Text
              style={[tw`text-xs font-semibold ml-1.5`, { color: "#B45309" }]}
            >
              Transfer in progress
            </Text>
          </View>

          {amountText && (
            <Text
              style={tw`text-gray-900 font-bold text-4xl mt-4 text-center`}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {AmountFormatter(amountText as string)}
            </Text>
          )}

          <Text style={tw`text-gray-500 text-sm leading-5 text-center mt-4`}>
            {message}
          </Text>
        </Animated.View>
      </View>

      <View style={tw`px-5 pb-4`}>
        <PrimaryBtn title={"Home"} onpressed={goHome} />
        <TouchableOpacity
          onPress={goToHistory}
          activeOpacity={0.7}
          style={tw`items-center py-3 mt-2`}
          accessibilityRole="button"
        >
          <Text style={tw`text-gray-600 font-medium text-sm`}>
            View transaction history
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SuccessTransaction;
