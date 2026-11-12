import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccessToken,
  selectRates,
  selectUserProfile,
  setRates,
  setUserProfile,
} from "@/hooks/redux/slice";
import {
  BASE_URL,
  GENERAL_URL,
  PRIMARY_COLOR,
  updatedevicetoken,
} from "@/hooks/api";
import Header from "@/components/Home/Header";
import Transactions from "@/components/Home/Transactions";
import { AmountFormatter } from "@/hooks/lib/formatter";

type IconName = React.ComponentProps<typeof Icon>["name"];

interface UserProfile {
  fullname?: string;
  email?: string;
}

interface Rate {
  name?: string;
  amount?: string | number;
}

// The tab bar is absolutely positioned, so content needs room beneath it.
const TAB_BAR_SPACE = 110;

const WHATSAPP_NUMBER = "447778068566";
const WHATSAPP_MESSAGE =
  "Hi Globees Ex, I'm interested in knowing more about the crypto section. Thank you";

const HERO_SHADOW = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 4,
};

/* -------------------------------------------------------------------------- */
/*  Rates card                                                                */
/* -------------------------------------------------------------------------- */

const RatesCard = ({ rates }: { rates?: Rate[] | null }) => {
  const isLoading = rates === null || rates === undefined;
  const items = (rates ?? []).slice(0, 2);

  return (
    <View
      style={[
        tw`mx-5 bg-white rounded-3xl p-5 border border-gray-100`,
        HERO_SHADOW,
        { marginTop: -48 },
      ]}
    >
      <Text style={tw`text-gray-900 font-semibold text-base mb-4`}>
        Today's rates
      </Text>

      {isLoading ? (
        <View style={tw`flex-row`}>
          {[0, 1].map((i) => (
            <View key={i} style={[tw`flex-1`, i === 0 ? tw`pr-5` : tw`pl-5`]}>
              <View style={tw`h-3 w-16 rounded bg-gray-200 mb-3`} />
              <View style={tw`h-6 w-24 rounded bg-gray-200`} />
            </View>
          ))}
        </View>
      ) : items.length === 0 ? (
        <Text style={tw`text-gray-500 text-sm`}>
          Rates are unavailable right now. Pull down to refresh.
        </Text>
      ) : (
        <View style={tw`flex-row`}>
          {items.map((rate, i) => (
            <View
              key={`${rate.name}-${i}`}
              style={[
                tw`flex-1`,
                i === 0 ? tw`pr-5` : tw`pl-5 border-l border-gray-100`,
              ]}
            >
              <Text style={tw`text-gray-500 text-xs mb-1`} numberOfLines={1}>
                {rate.name}
              </Text>
              <Text
                style={tw`text-gray-900 font-bold text-2xl`}
                numberOfLines={1}
              >
                ₦{AmountFormatter(rate.amount as string)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*  Quick actions                                                             */
/* -------------------------------------------------------------------------- */

interface QuickAction {
  key: string;
  label: string;
  icon: IconName;
  tint: string;
  bg: string;
  onPress: () => void;
}

const QuickActions = ({ actions }: { actions: QuickAction[] }) => (
  <View
    style={tw`mx-5 mt-5 bg-white rounded-2xl border border-gray-100 py-4 flex-row`}
  >
    {actions.map((action) => (
      <TouchableOpacity
        key={action.key}
        style={tw`flex-1 items-center`}
        activeOpacity={0.7}
        onPress={action.onPress}
        accessibilityRole="button"
        accessibilityLabel={action.label}
      >
        <View
          style={[
            tw`w-12 h-12 rounded-2xl items-center justify-center`,
            { backgroundColor: action.bg },
          ]}
        >
          <Icon name={action.icon} size={22} color={action.tint} />
        </View>
        <Text style={tw`text-gray-800 text-xs font-medium mt-2`}>
          {action.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

const HomeScreen = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile) as UserProfile | null;
  const rates = useSelector(selectRates) as Rate[] | null | undefined;
  const accessToken = useSelector(selectAccessToken) as string;

  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    const profileTask = axios
      .get(`${BASE_URL}/profile`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(async (res) => {
        const data = res.data.data;
        dispatch(setUserProfile(data));
        await updatedevicetoken(data.email, accessToken);
      });

    const ratesTask = axios
      .get(`${GENERAL_URL}/rates`)
      .then((res) => dispatch(setRates(res.data.message)));

    // One failing request shouldn't block the other from updating.
    const results = await Promise.allSettled([profileTask, ratesTask]);
    results.forEach((r) => {
      if (r.status === "rejected") console.error("Refresh failed:", r.reason);
    });

    setRefreshKey((k) => k + 1);
    setRefreshing(false);
  }, [accessToken, dispatch]);

  const handleCryptoPress = () => {
    if (Platform.OS === "ios") {
      Linking.openURL(
        `whatsapp://send?text=${encodeURIComponent(WHATSAPP_MESSAGE)}&phone=${WHATSAPP_NUMBER}`,
      ).catch(() => {
        Alert.alert(
          "WhatsApp not found",
          "Install WhatsApp to chat with us about crypto.",
        );
      });
    } else {
      router.push("/(tabs)/CryptoScreen");
    }
  };

  const actions: QuickAction[] = [
    {
      key: "exchange",
      label: "Exchange",
      icon: "swap-horizontal-outline",
      tint: "#2563EB",
      bg: "#EFF6FF",
      onPress: () => router.push("/(tabs)/ExchangeScreen"),
    },
    {
      key: "crypto",
      label: "Crypto",
      icon: "logo-bitcoin",
      tint: "#059669",
      bg: "#ECFDF5",
      onPress: handleCryptoPress,
    },
    {
      key: "pay",
      label: "Pay",
      icon: "card-outline",
      tint: "#7C3AED",
      bg: "#F5F3FF",
      onPress: () => router.push("/(tabs)/PaymentScreen"),
    },
  ];

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
      >
        <Header
          name={userProfile?.fullname}
          onNotificationsPress={() => router.push("/NotificationScreen")}
        />

        <RatesCard rates={rates} />

        <QuickActions actions={actions} />

        {/* Bonus banner */}
        <TouchableOpacity
          style={[
            tw`mx-5 mt-5 flex-row items-center rounded-2xl p-4`,
            {
              backgroundColor: "#FFFBEB",
              borderWidth: 1,
              borderColor: "#FDE68A",
            },
          ]}
          activeOpacity={0.85}
          onPress={() => router.push("/RewardsScreen")}
          accessibilityRole="button"
          accessibilityLabel="Get a 15 pound bonus. Complete your first transaction."
        >
          <View
            style={[
              tw`w-10 h-10 rounded-xl items-center justify-center mr-3`,
              { backgroundColor: "#FBBF24" },
            ]}
          >
            <Icon name="gift" size={20} color="#78350F" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-gray-900 font-semibold text-sm`}>
              Get a £15 bonus
            </Text>
            <Text style={tw`text-gray-600 text-xs mt-0.5`}>
              Complete your first transaction
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={tw`mt-6`}>
          <Transactions refreshKey={refreshKey} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
