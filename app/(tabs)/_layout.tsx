import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PRIMARY_COLOR } from "@/hooks/api";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type TabConfig = {
  name: string;
  title: string;
  icon: IconName;
  iconFocused: IconName;
};

const TABS: TabConfig[] = [
  { name: "index", title: "Home", icon: "home-outline", iconFocused: "home" },
  {
    name: "ExchangeScreen",
    title: "Exchange",
    icon: "swap-horizontal-outline",
    iconFocused: "swap-horizontal",
  },
  {
    name: "CryptoScreen",
    title: "Crypto",
    icon: "logo-bitcoin",
    iconFocused: "logo-bitcoin",
  },
  {
    name: "PaymentScreen",
    title: "Payment",
    icon: "card-outline",
    iconFocused: "card",
  },
  {
    name: "MoreScreen",
    title: "More",
    icon: "grid-outline",
    iconFocused: "grid",
  },
];

const INACTIVE_COLOR = "#9CA3AF";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      {TABS.map(({ name, title, icon, iconFocused }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? iconFocused : icon}
                color={color as string}
                size={focused ? 24 : 22}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    height: Platform.OS === "ios" ? 88 : 70,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: "absolute",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    // Android shadow
    elevation: 12,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginTop: 2,
  },
  tabItem: {
    paddingVertical: 2,
  },
});
