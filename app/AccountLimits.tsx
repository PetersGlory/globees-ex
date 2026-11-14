import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import Icon from "@expo/vector-icons/Ionicons";
import CustomHeader from "@/components/common/CustomHeader";
import { PRIMARY_COLOR } from "@/hooks/api";

type IconName = React.ComponentProps<typeof Icon>["name"];
type CurrencyKey = "NGN" | "GBP";

interface CurrencyLimits {
  key: CurrencyKey;
  tab: string;
  symbol: string;
  perTransaction: number;
  periods: { label: string; icon: IconName; amount: number }[];
}

const LIMITS: CurrencyLimits[] = [
  {
    key: "NGN",
    tab: "🇳🇬  NGN",
    symbol: "₦",
    perTransaction: 5000000,
    periods: [
      { label: "Daily", icon: "today-outline", amount: 5000000 },
      { label: "Weekly", icon: "calendar-outline", amount: 15000000 },
      { label: "Monthly", icon: "calendar-number-outline", amount: 50000000 },
    ],
  },
  {
    key: "GBP",
    tab: "🇬🇧  GBP",
    symbol: "£",
    perTransaction: 5000,
    periods: [
      { label: "Daily", icon: "today-outline", amount: 5000 },
      { label: "Weekly", icon: "calendar-outline", amount: 15000 },
      { label: "Monthly", icon: "calendar-number-outline", amount: 30000 },
    ],
  },
];

const formatAmount = (symbol: string, value: number) =>
  `${symbol}${value.toLocaleString("en-US")}`;

const AccountLimits = () => {
  const [currency, setCurrency] = useState<CurrencyKey>("NGN");
  const active = LIMITS.find((l) => l.key === currency) ?? LIMITS[0];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
      >
        <CustomHeader title={"Account Limits"} />

        <Text style={tw`text-gray-500 text-sm text-center mt-4 leading-5`}>
          See how much you can spend with your Globees Ex account.
        </Text>

        <View style={tw`flex-row bg-gray-100 rounded-2xl p-1 mt-6`}>
          {LIMITS.map((item) => {
            const selected = item.key === currency;
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.8}
                onPress={() => setCurrency(item.key)}
                style={[
                  tw`flex-1 py-2.5 rounded-xl items-center`,
                  selected && tw`bg-white border border-gray-200`,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text
                  style={[
                    tw`text-sm`,
                    selected
                      ? tw`text-gray-900 font-semibold`
                      : tw`text-gray-500 font-medium`,
                  ]}
                >
                  {item.tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={[tw`rounded-3xl p-6 mt-5`, { backgroundColor: PRIMARY_COLOR }]}
        >
          <View style={tw`flex-row items-center`}>
            <View
              style={tw`w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-2`}
            >
              <Icon name="swap-vertical-outline" size={16} color="#FFFFFF" />
            </View>
            <Text style={tw`text-white/80 text-sm`}>Limit per transaction</Text>
          </View>
          <Text
            style={tw`text-white font-bold text-3xl mt-4`}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatAmount(active.symbol, active.perTransaction)}
          </Text>
          <Text style={tw`text-white/70 text-xs mt-1`}>{active.key}</Text>
        </View>

        <Text style={tw`text-gray-900 font-semibold text-base mt-7 mb-3`}>
          Spending limits
        </Text>

        <View
          style={tw`bg-white rounded-2xl border border-gray-100 overflow-hidden`}
        >
          {active.periods.map((period, i) => (
            <View
              key={period.label}
              style={[
                tw`flex-row items-center px-4 py-4`,
                i > 0 && tw`border-t border-gray-100`,
              ]}
            >
              <View
                style={[
                  tw`w-10 h-10 rounded-xl items-center justify-center mr-3`,
                  { backgroundColor: "#EFF6FF" },
                ]}
              >
                <Icon name={period.icon} size={20} color="#2563EB" />
              </View>
              <Text style={tw`flex-1 text-gray-600 text-sm`}>
                {period.label}
              </Text>
              <Text style={tw`text-gray-900 font-bold text-base`}>
                {formatAmount(active.symbol, period.amount)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountLimits;
