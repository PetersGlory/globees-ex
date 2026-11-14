import React, { useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import Icon from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { selectAccessToken, selectUserProfile } from "@/hooks/redux/slice";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api";
import CustomHeader from "@/components/common/CustomHeader";
import LogOutModal from "@/components/common/Modals/LogOutModal";
import CustomLegal from "@/components/common/Modals/CustomLegal";
import CustomAbout from "@/components/common/Modals/CustomAbout";
import CustomSocial from "@/components/common/Modals/CustomSocial";
import CustomVerify from "@/components/common/Modals/CustomVerify";
import LoadingModal from "@/components/common/Modals/LoadingModal";
import app from "../../app.json";

type IconName = React.ComponentProps<typeof Icon>["name"];

interface Profile {
  fullname?: string;
  email?: string;
  verified_user?: string;
}

interface MenuItem {
  key: string;
  title: string;
  icon: IconName;
  tint: string;
  bg: string;
  onPress: () => void;
  danger?: boolean;
  trailing?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const TAB_BAR_SPACE = 110;
const WHATSAPP_NUMBER = "447778068566";
const WHATSAPP_MESSAGE =
  "Hi Globees Ex, I'm contacting from the app and I will need more enquiry. Thank you";
const BLOG_URL = "https://globeesex.blogspot.com/";

const getInitials = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const MenuRow = ({ item, divider }: { item: MenuItem; divider: boolean }) => (
  <TouchableOpacity
    onPress={item.onPress}
    activeOpacity={0.7}
    style={[
      tw`flex-row items-center px-4 py-3.5`,
      divider && tw`border-t border-gray-100`,
    ]}
    accessibilityRole="button"
    accessibilityLabel={item.title}
  >
    <View
      style={[
        tw`w-10 h-10 rounded-xl items-center justify-center mr-3`,
        { backgroundColor: item.bg },
      ]}
    >
      <Icon name={item.icon} size={20} color={item.tint} />
    </View>
    <Text
      style={[
        tw`flex-1 text-base font-medium`,
        { color: item.danger ? "#DC2626" : "#1F2937" },
      ]}
    >
      {item.title}
    </Text>
    {item.trailing ? (
      <Text style={tw`text-emerald-600 text-xs font-semibold mr-2`}>
        {item.trailing}
      </Text>
    ) : null}
    <Icon name="chevron-forward" size={18} color="#9CA3AF" />
  </TouchableOpacity>
);

const MoreScreen = () => {
  const userProfile = useSelector(selectUserProfile) as Profile | null;
  const token = useSelector(selectAccessToken);

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [socialVisible, setSocialVisible] = useState(false);
  const [legalVisible, setLegalVisible] = useState(false);
  const [verifyVisible, setVerifyVisible] = useState(false);

  const isVerified =
    userProfile?.verified_user === "yes" ||
    userProfile?.verified_user === "true";
  const initials = getInitials(userProfile?.fullname);

  const openSupport = () => {
    Linking.openURL(
      `whatsapp://send?text=${encodeURIComponent(WHATSAPP_MESSAGE)}&phone=${WHATSAPP_NUMBER}`,
    ).catch(() => {
      Alert.alert(
        "WhatsApp not found",
        "Install WhatsApp to chat with our support team.",
      );
    });
  };

  const openIdentity = () => {
    if (isVerified) {
      setVerifyVisible(true);
    } else {
      router.navigate("IdentityVerify" as never);
    }
  };

  const handleLogout = async () => {
    setConfirmLogout(false);
    await AsyncStorage.removeItem("accessToken");
    router.replace("/LoginScreen");
  };

  const handleDelete = async () => {
    setConfirmDelete(false);
    setDeleting(true);
    try {
      const response = await axios.get(`${BASE_URL}/delete-account`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const succeeded =
        (response.status === 200 || response.status === 201) &&
        !response.data?.error;
      if (!succeeded) throw new Error("Account deletion failed");
      await AsyncStorage.clear();
      router.replace("/LoginScreen");
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Couldn't delete account",
        "Something went wrong. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const sections: MenuSection[] = [
    {
      title: "Account",
      items: [
        {
          key: "profile",
          title: "Profile",
          icon: "person-outline",
          tint: "#2563EB",
          bg: "#EFF6FF",
          onPress: () => router.navigate("ProfileScreen" as never),
        },
        {
          key: "history",
          title: "Transaction history",
          icon: "time-outline",
          tint: "#059669",
          bg: "#ECFDF5",
          onPress: () => router.navigate("TransactionScreen" as never),
        },
        {
          key: "identity",
          title: "Identity verification",
          icon: "id-card-outline",
          tint: "#7C3AED",
          bg: "#F5F3FF",
          trailing: isVerified ? "Verified" : undefined,
          onPress: openIdentity,
        },
        {
          key: "limits",
          title: "Account limits",
          icon: "shield-checkmark-outline",
          tint: "#0EA5E9",
          bg: "#F0F9FF",
          onPress: () => router.push("/AccountLimits" as never),
        },
        {
          key: "rewards",
          title: "Rewards",
          icon: "gift-outline",
          tint: "#D97706",
          bg: "#FFFBEB",
          onPress: () => router.navigate("RewardsScreen" as never),
        },
      ],
    },
    {
      title: "Support & information",
      items: [
        {
          key: "support",
          title: "Help & support",
          icon: "headset-outline",
          tint: "#0D9488",
          bg: "#F0FDFA",
          onPress: openSupport,
        },
        {
          key: "social",
          title: "Social media",
          icon: "thumbs-up-outline",
          tint: "#DB2777",
          bg: "#FDF2F8",
          onPress: () => setSocialVisible(true),
        },
        {
          key: "blog",
          title: "Blog",
          icon: "newspaper-outline",
          tint: "#4F46E5",
          bg: "#EEF2FF",
          onPress: () => Linking.openURL(BLOG_URL),
        },
        {
          key: "about",
          title: "About",
          icon: "information-circle-outline",
          tint: "#475569",
          bg: "#F1F5F9",
          onPress: () => setAboutVisible(true),
        },
        {
          key: "legal",
          title: "Legal",
          icon: "document-text-outline",
          tint: "#475569",
          bg: "#F1F5F9",
          onPress: () => setLegalVisible(true),
        },
      ],
    },
    {
      title: "Session",
      items: [
        {
          key: "logout",
          title: "Log out",
          icon: "log-out-outline",
          tint: "#EA580C",
          bg: "#FFF7ED",
          onPress: () => setConfirmLogout(true),
        },
        {
          key: "delete",
          title: "Delete account",
          icon: "trash-outline",
          tint: "#DC2626",
          bg: "#FEF2F2",
          danger: true,
          onPress: () => setConfirmDelete(true),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: TAB_BAR_SPACE,
        }}
      >
        <CustomHeader title="Settings" />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.navigate("ProfileScreen" as never)}
          style={tw`flex-row items-center bg-white rounded-2xl border border-gray-100 p-4 mt-4`}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
        >
          <View
            style={[
              tw`w-14 h-14 rounded-full items-center justify-center mr-4`,
              { backgroundColor: PRIMARY_COLOR },
            ]}
          >
            {initials ? (
              <Text style={tw`text-white font-bold text-lg`}>{initials}</Text>
            ) : (
              <Icon name="person" size={24} color="#FFFFFF" />
            )}
          </View>

          <View style={tw`flex-1`}>
            <Text style={tw`text-gray-900 font-bold text-lg`} numberOfLines={1}>
              {userProfile?.fullname || "User"}
            </Text>
            <Text style={tw`text-gray-500 text-sm mt-0.5`} numberOfLines={1}>
              {userProfile?.email || "—"}
            </Text>
            <View
              style={[
                tw`flex-row items-center self-start rounded-full px-2.5 py-1 mt-2`,
                { backgroundColor: isVerified ? "#ECFDF5" : "#FEF2F2" },
              ]}
            >
              <Icon
                name={isVerified ? "checkmark-circle" : "alert-circle"}
                size={14}
                color={isVerified ? "#047857" : "#B91C1C"}
              />
              <Text
                style={[
                  tw`text-xs font-semibold ml-1`,
                  { color: isVerified ? "#047857" : "#B91C1C" },
                ]}
              >
                {isVerified ? "Verified" : "Unverified"}
              </Text>
            </View>
          </View>

          <Icon name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {!isVerified && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.navigate("IdentityVerify" as never)}
            style={[
              tw`flex-row items-center rounded-2xl p-4 mt-3`,
              {
                backgroundColor: "#FFFBEB",
                borderWidth: 1,
                borderColor: "#FDE68A",
              },
            ]}
            accessibilityRole="button"
          >
            <Icon name="shield-checkmark-outline" size={22} color="#B45309" />
            <View style={tw`flex-1 ml-3`}>
              <Text style={tw`text-gray-900 font-semibold text-sm`}>
                Verify your identity
              </Text>
              <Text style={tw`text-gray-600 text-xs mt-0.5`}>
                Required before you can exchange crypto.
              </Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#B45309" />
          </TouchableOpacity>
        )}

        {sections.map((section) => (
          <View key={section.title} style={tw`mt-6`}>
            <Text
              style={[
                tw`text-gray-500 text-xs font-semibold mb-2 ml-1`,
                { letterSpacing: 0.6, textTransform: "uppercase" },
              ]}
            >
              {section.title}
            </Text>
            <View
              style={tw`bg-white rounded-2xl border border-gray-100 overflow-hidden`}
            >
              {section.items.map((item, i) => (
                <MenuRow key={item.key} item={item} divider={i > 0} />
              ))}
            </View>
          </View>
        ))}

        <Text style={tw`text-center text-gray-400 text-xs mt-8`}>
          GlobeesEx v{app.expo.version}
        </Text>
      </ScrollView>

      {confirmLogout && (
        <LogOutModal
          visibility={confirmLogout}
          setVisibility={setConfirmLogout}
          text={"Are you sure you want to log out?"}
          onPressed={handleLogout}
        />
      )}

      {confirmDelete && (
        <LogOutModal
          visibility={confirmDelete}
          setVisibility={setConfirmDelete}
          text={
            "Are you sure you want to delete your account? This can't be undone."
          }
          onPressed={handleDelete}
        />
      )}

      <CustomLegal visibility={legalVisible} setVisibility={setLegalVisible} />
      <CustomAbout visibility={aboutVisible} setVisibility={setAboutVisible} />
      <CustomSocial
        visibility={socialVisible}
        setVisibility={setSocialVisible}
      />
      <CustomVerify
        visibility={verifyVisible}
        setVisibility={setVerifyVisible}
      />

      <LoadingModal visibility={deleting} text="Deleting account…" />
    </SafeAreaView>
  );
};

export default MoreScreen;
