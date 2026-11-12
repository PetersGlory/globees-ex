import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PRIMARY_COLOR } from "@/hooks/api";

interface HeaderProps {
  name?: string;
  onNotificationsPress: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const getInitials = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/**
 * Presentational header. Data fetching and refresh live in the screen
 * (pull-to-refresh), so this component only renders what it's given.
 * Bottom padding is intentionally generous: the rates card overlaps it.
 */
const Header = ({ name, onNotificationsPress }: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const initials = getInitials(name);

  return (
    <View
      style={[
        tw`px-5`,
        {
          backgroundColor: PRIMARY_COLOR,
          paddingTop: insets.top + 12,
          paddingBottom: 72,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        },
      ]}
    >
      <View style={tw`flex-row items-center`}>
        {/* Avatar */}
        <View
          style={tw`w-11 h-11 rounded-full bg-white/20 items-center justify-center mr-3`}
        >
          {initials ? (
            <Text style={tw`text-white font-bold text-base`}>{initials}</Text>
          ) : (
            <Icon name="person" size={20} color="#FFFFFF" />
          )}
        </View>

        {/* Greeting */}
        <View style={tw`flex-1`}>
          <Text style={tw`text-white/70 text-xs mb-0.5`}>{getGreeting()}</Text>
          {name ? (
            <Text style={tw`text-white font-bold text-lg`} numberOfLines={1}>
              {name}
            </Text>
          ) : (
            <View style={tw`h-5 w-32 rounded bg-white/25 mt-0.5`} />
          )}
        </View>

        {/* Notifications */}
        <TouchableOpacity
          onPress={onNotificationsPress}
          activeOpacity={0.7}
          style={tw`w-10 h-10 rounded-full bg-white/15 items-center justify-center`}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Icon name="notifications-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
