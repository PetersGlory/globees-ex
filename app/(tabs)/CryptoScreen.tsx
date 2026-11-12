import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRates,
  selectUserProfile,
  setExchanger,
} from "@/hooks/redux/slice";
import { NumberFormatter } from "@/hooks/lib/formatter";
import { PRIMARY_COLOR } from "@/hooks/api";
import CustomHeader from "@/components/common/CustomHeader";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import LogOutModal from "@/components/common/Modals/LogOutModal";

const ASSETS = [
  { symbol: "BTC", name: "Bitcoin", rateKey: "BTC - Crypto" },
  { symbol: "USDT", name: "Tether", rateKey: "USDT - Crypto" },
  { symbol: "ETH", name: "Ethereum", rateKey: "ETH - Crypto" },
] as const;

type AssetSymbol = (typeof ASSETS)[number]["symbol"];

interface Rate {
  name?: string;
  amount?: string | number;
}

interface Profile {
  verified_user?: string;
}

const TAB_BAR_SPACE = 110;
const WHATSAPP_NUMBER = "447778068566";
const WHATSAPP_MESSAGE =
  "Hi Globees Ex, I'm interested in knowing more about the crypto section. Thank you";

const sanitizeAmount = (value: string) => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  return parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
};

const formatCrypto = (value: number) => {
  const fixed = value.toFixed(8);
  return fixed.includes(".")
    ? fixed.replace(/0+$/, "").replace(/\.$/, "")
    : fixed;
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={tw`flex-row items-center justify-between py-2`}>
    <Text style={tw`text-gray-500 text-sm`}>{label}</Text>
    <Text style={tw`text-gray-900 text-sm font-medium`}>{value}</Text>
  </View>
);

const CryptoScreen = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile) as Profile | null;
  const rates = useSelector(selectRates) as Rate[] | null | undefined;

  const [asset, setAsset] = useState<AssetSymbol | null>(null);
  const [usdAmount, setUsdAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const amount = Number(usdAmount);
  const isVerified = userProfile?.verified_user === "yes";

  const rateValue = useMemo(() => {
    if (!asset) return null;
    const key = ASSETS.find((a) => a.symbol === asset)?.rateKey;
    const match = rates?.find((r) => r.name === key);
    const value = Number(match?.amount);
    return value > 0 ? value : null;
  }, [asset, rates]);

  const payout = amount > 0 && rateValue ? amount * rateValue : null;

  useEffect(() => {
    setQuoteError(false);

    if (!asset || !(amount > 0)) {
      setCryptoAmount("");
      setQuoteLoading(false);
      return;
    }

    if (asset === "USDT") {
      setCryptoAmount(usdAmount);
      setQuoteLoading(false);
      return;
    }

    let cancelled = false;
    setQuoteLoading(true);

    const timer = setTimeout(async () => {
      try {
        let converted: number;
        if (asset === "BTC") {
          const response = await axios.get("https://blockchain.info/tobtc", {
            params: { currency: "USD", value: amount },
          });
          converted = Number(response.data);
        } else {
          const response = await axios.get(
            "https://min-api.cryptocompare.com/data/price",
            {
              params: { fsym: "USD", tsyms: "ETH" },
            },
          );
          converted = Number(response.data.ETH) * amount;
        }

        if (cancelled) return;
        if (!isFinite(converted) || converted <= 0)
          throw new Error("Invalid quote");
        setCryptoAmount(formatCrypto(converted));
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setCryptoAmount("");
          setQuoteError(true);
        }
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [asset, usdAmount]);

  const handleContinue = () => {
    if (!asset) {
      Alert.alert(
        "Select a currency",
        "Choose the digital currency you want to exchange.",
      );
      return;
    }
    if (!(amount > 0)) {
      Alert.alert(
        "Enter an amount",
        "Enter the USD value you want to exchange.",
      );
      return;
    }
    if (!isVerified) {
      Alert.alert(
        "Verification required",
        "Verify your identity under More › Identity verification to continue.",
      );
      return;
    }
    if (quoteLoading || !cryptoAmount) {
      Alert.alert("Please wait", "We're still calculating your conversion.");
      return;
    }
    setConfirmVisible(true);
  };

  const handleExchange = () => {
    setConfirmVisible(false);
    dispatch(setExchanger({ from: usdAmount, to: cryptoAmount }));
    router.push({
      pathname: "/ReceiverScreen",
      params: {
        request_type: "crypto",
        currency_from: asset,
        currency_to: "USD",
      },
    });
  };

  const openWhatsApp = () => {
    Linking.openURL(
      `whatsapp://send?text=${encodeURIComponent(WHATSAPP_MESSAGE)}&phone=${WHATSAPP_NUMBER}`,
    ).catch(() => {
      Alert.alert(
        "WhatsApp not found",
        "Install WhatsApp to chat with our support team.",
      );
    });
  };

  if (Platform.OS === "ios") {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <StatusBar style="dark" />
        <View style={tw`px-5`}>
          <CustomHeader title={"Crypto Exchange"} />
        </View>

        <View style={tw`flex-1 items-center justify-center px-8`}>
          <View
            style={[
              tw`w-20 h-20 rounded-full items-center justify-center mb-6`,
              { backgroundColor: "#DCFCE7" },
            ]}
          >
            <Ionicons name="logo-whatsapp" size={40} color="#16A34A" />
          </View>
          <Text style={tw`text-gray-900 font-bold text-xl text-center`}>
            Crypto exchange is coming to iOS
          </Text>
          <Text style={tw`text-gray-500 text-sm text-center mt-3 leading-5`}>
            In the meantime, our support team can help you convert your crypto
            to cash on WhatsApp.
          </Text>
          <TouchableOpacity
            onPress={openWhatsApp}
            activeOpacity={0.85}
            style={[
              tw`flex-row items-center justify-center rounded-xl px-6 py-3.5 mt-8`,
              { backgroundColor: "#25D366" },
            ]}
            accessibilityRole="button"
          >
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
            <Text style={tw`text-white font-semibold text-sm ml-2`}>
              Chat with support
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: TAB_BAR_SPACE,
        }}
      >
        <CustomHeader title={"Crypto Exchange"} />

        <Text style={tw`text-gray-900 font-semibold text-sm mt-5 mb-3`}>
          Choose a currency
        </Text>
        <View style={tw`flex-row`}>
          {ASSETS.map((item, i) => {
            const active = asset === item.symbol;
            return (
              <TouchableOpacity
                key={item.symbol}
                activeOpacity={0.8}
                onPress={() => setAsset(item.symbol)}
                style={[
                  tw`flex-1 rounded-2xl py-3 items-center`,
                  i > 0 && tw`ml-3`,
                  {
                    backgroundColor: active ? "#FFFFFF" : "#F3F4F6",
                    borderWidth: 1.5,
                    borderColor: active ? PRIMARY_COLOR : "transparent",
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    tw`font-bold text-base`,
                    { color: active ? PRIMARY_COLOR : "#374151" },
                  ]}
                >
                  {item.symbol}
                </Text>
                <Text style={tw`text-gray-500 text-xs mt-0.5`}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={tw`bg-white rounded-2xl border border-gray-100 p-5 mt-5`}>
          <Text style={tw`text-gray-500 text-xs`}>Amount in USD</Text>
          <View style={tw`flex-row items-center mt-2`}>
            <Text style={tw`text-gray-400 text-3xl font-bold mr-1`}>$</Text>
            <TextInput
              value={usdAmount}
              onChangeText={(val) => setUsdAmount(sanitizeAmount(val))}
              placeholder="0.00"
              placeholderTextColor="#D1D5DB"
              keyboardType="decimal-pad"
              returnKeyType="done"
              style={tw`flex-1 text-gray-900 text-3xl font-bold p-0`}
            />
          </View>

          <View style={tw`h-px bg-gray-100 my-4`} />

          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-500 text-sm`}>You'll send</Text>
            {quoteLoading ? (
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            ) : quoteError ? (
              <Text style={tw`text-red-600 text-sm`}>Couldn't get a quote</Text>
            ) : (
              <Text style={tw`text-gray-900 text-sm font-semibold`}>
                {cryptoAmount && asset ? `${cryptoAmount} ${asset}` : "—"}
              </Text>
            )}
          </View>
        </View>

        <View style={tw`items-center -my-3 z-10`}>
          <View
            style={[
              tw`w-9 h-9 rounded-full items-center justify-center`,
              {
                backgroundColor: PRIMARY_COLOR,
                borderWidth: 3,
                borderColor: "#F9FAFB",
              },
            ]}
          >
            <Ionicons name="arrow-down" size={16} color="#FFFFFF" />
          </View>
        </View>

        <View style={tw`bg-white rounded-2xl border border-gray-100 p-5`}>
          <Text style={tw`text-gray-500 text-xs`}>You receive</Text>
          <Text
            style={[
              tw`text-3xl font-bold mt-2`,
              { color: payout ? "#111827" : "#D1D5DB" },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            ₦{payout ? NumberFormatter(payout) : "0.00"}
          </Text>

          <View style={tw`h-px bg-gray-100 my-4`} />

          <InfoRow
            label="Rate"
            value={
              rateValue
                ? `$1 = ₦${NumberFormatter(rateValue)}`
                : asset
                  ? "Unavailable"
                  : "Select a currency"
            }
          />
          <InfoRow label="Payout time" value="Within minutes" />
        </View>

        {!isVerified && (
          <View
            style={[
              tw`flex-row rounded-2xl p-4 mt-5`,
              {
                backgroundColor: "#FFFBEB",
                borderWidth: 1,
                borderColor: "#FDE68A",
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#B45309"
            />
            <View style={tw`flex-1 ml-3`}>
              <Text style={tw`text-gray-900 font-semibold text-sm`}>
                Verify your identity
              </Text>
              <Text style={tw`text-gray-600 text-xs mt-0.5 leading-4`}>
                You need a verified account to exchange crypto. Go to More ›
                Identity verification.
              </Text>
            </View>
          </View>
        )}

        <View style={tw`mt-8`}>
          <PrimaryBtn title={"Continue"} onpressed={handleContinue} />
        </View>
      </ScrollView>

      {confirmVisible && (
        <LogOutModal
          visibility={confirmVisible}
          setVisibility={setConfirmVisible}
          text={`Are you sure you want to proceed to exchange ${cryptoAmount} ${asset}?`}
          onPressed={handleExchange}
        />
      )}
    </SafeAreaView>
  );
};

export default CryptoScreen;
