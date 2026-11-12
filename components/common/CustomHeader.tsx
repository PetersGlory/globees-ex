import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { PRIMARY_COLOR } from "@/hooks/api";

const CustomHeader = ({ title }: { title: string }) => {
  return (
    <View style={styles.header}>
      <StatusBar style="dark" />

      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [
          styles.iconButton,
          pressed && styles.iconButtonPressed,
        ]}
      >
        <Icon name="chevron-back-outline" size={20} color={PRIMARY_COLOR} />
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <Pressable
        onPress={() => router.push("/NotificationScreen")}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        style={({ pressed }) => [
          styles.iconButton,
          pressed && styles.iconButtonPressed,
        ]}
      >
        <Icon name="notifications-outline" size={19} color={PRIMARY_COLOR} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconButtonPressed: {
    opacity: 0.6,
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: PRIMARY_COLOR,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginHorizontal: 10,
  },
});

export default CustomHeader;
