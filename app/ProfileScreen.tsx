import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import Icon from "@expo/vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccessToken,
  selectUserProfile,
  setUserProfile,
} from "@/hooks/redux/slice";
import { usePushNotification } from "@/usePushNotification";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api";
import CustomHeader from "@/components/common/CustomHeader";
import LoadingModal from "@/components/common/Modals/LoadingModal";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import CustomDropdown from "@/components/common/CustomDropdown";

interface Profile {
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  country?: string;
  verified_user?: string;
}

interface FormState {
  fullname: string;
  phone: string;
  address: string;
  gender: string;
  country: string;
}

const GENDERS = ["Male", "Female"];

const buildForm = (
  profile: Profile | null,
  storedCountry: string | null,
): FormState => ({
  fullname: profile?.fullname || "",
  phone: profile?.phone || "+234",
  address: profile?.address || "",
  gender: profile?.gender || "",
  country: storedCountry || profile?.country || "",
});

const getInitials = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const Field = ({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) => (
  <View style={tw`mb-5`}>
    <Text style={tw`text-gray-500 text-xs font-medium mb-2`}>{label}</Text>
    {children}
    {helper ? (
      <Text style={tw`text-gray-400 text-xs mt-1.5`}>{helper}</Text>
    ) : null}
  </View>
);

const ReadOnlyBox = ({
  value,
  locked,
}: {
  value?: string;
  locked?: boolean;
}) => (
  <View
    style={tw`flex-row items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5`}
  >
    <Text
      style={[tw`flex-1 text-base`, { color: value ? "#1F2937" : "#9CA3AF" }]}
      numberOfLines={1}
    >
      {value || "Not set"}
    </Text>
    {locked && <Icon name="lock-closed-outline" size={16} color="#9CA3AF" />}
  </View>
);

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const profileUser = useSelector(selectUserProfile) as Profile | null;
  const token = useSelector(selectAccessToken);
  const { expoPushToken } = usePushNotification();

  const [saved, setSaved] = useState<FormState>(buildForm(null, null));
  const [form, setForm] = useState<FormState>(buildForm(null, null));
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const isVerified =
    profileUser?.verified_user === "yes" ||
    profileUser?.verified_user === "true";

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const storedCountry = await AsyncStorage.getItem("userCountry");
      if (cancelled) return;
      const next = buildForm(profileUser, storedCountry);
      setSaved(next);
      setForm(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [profileUser]);

  useEffect(() => {
    if (expoPushToken?.data) {
      AsyncStorage.setItem("pushToken", expoPushToken.data);
    }
  }, [expoPushToken?.data]);

  const update = (patch: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleCancel = () => {
    setForm(saved);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!form.fullname.trim()) {
      Alert.alert("Name required", "Please enter your full name.");
      return;
    }

    setSaving(true);
    try {
      const result = await axios.post(`${BASE_URL}/update/profile`, form, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (result.data.error) {
        Alert.alert(
          "Couldn't update profile",
          result.data.message || "Please try again.",
        );
        return;
      }

      await AsyncStorage.setItem("userCountry", form.country);
      dispatch(setUserProfile({ ...profileUser, ...form }));
      setSaved(form);
      setIsEditing(false);
      Alert.alert("Profile updated", "Your changes have been saved.");
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Couldn't update profile",
        "Check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = [
    tw`rounded-xl px-4 py-3.5 text-base text-gray-900`,
    { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D1D5DB" },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <CustomHeader title="Profile" />

          <View style={tw`items-center mt-6`}>
            <View
              style={[
                tw`w-24 h-24 rounded-full items-center justify-center`,
                { backgroundColor: PRIMARY_COLOR },
              ]}
            >
              {getInitials(profileUser?.fullname) ? (
                <Text style={tw`text-white font-bold text-3xl`}>
                  {getInitials(profileUser?.fullname)}
                </Text>
              ) : (
                <Icon name="person" size={40} color="#FFFFFF" />
              )}
            </View>

            <Text style={tw`text-gray-900 font-bold text-xl mt-4`}>
              {profileUser?.fullname || "Your profile"}
            </Text>
            <Text style={tw`text-gray-500 text-sm mt-1`}>
              {profileUser?.email || "—"}
            </Text>

            <View
              style={[
                tw`flex-row items-center rounded-full px-3 py-1.5 mt-3`,
                { backgroundColor: isVerified ? "#ECFDF5" : "#FFFBEB" },
              ]}
            >
              <Icon
                name={isVerified ? "checkmark-circle" : "time"}
                size={14}
                color={isVerified ? "#047857" : "#B45309"}
              />
              <Text
                style={[
                  tw`text-xs font-semibold ml-1.5`,
                  { color: isVerified ? "#047857" : "#B45309" },
                ]}
              >
                {isVerified ? "Verified account" : "Pending verification"}
              </Text>
            </View>
          </View>

          <View
            style={tw`bg-white rounded-2xl border border-gray-100 p-5 mt-6`}
          >
            <Text style={tw`text-gray-900 font-semibold text-base mb-5`}>
              Personal information
            </Text>

            <Field label="Full name">
              {isEditing ? (
                <TextInput
                  style={inputStyle}
                  value={form.fullname}
                  onChangeText={(val) => update({ fullname: val })}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              ) : (
                <ReadOnlyBox value={form.fullname} />
              )}
            </Field>

            <Field
              label="Mobile number"
              helper="Your phone number can't be changed."
            >
              <ReadOnlyBox value={form.phone} locked />
            </Field>

            <Field label="Address">
              {isEditing ? (
                <TextInput
                  style={inputStyle}
                  value={form.address}
                  onChangeText={(val) => update({ address: val })}
                  placeholder="Enter your address"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="done"
                />
              ) : (
                <ReadOnlyBox value={form.address} />
              )}
            </Field>

            <Field label="Gender">
              {isEditing ? (
                <View style={tw`flex-row`}>
                  {GENDERS.map((option, i) => {
                    const active = form.gender === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        activeOpacity={0.8}
                        onPress={() => update({ gender: option })}
                        style={[
                          tw`flex-1 py-3.5 rounded-xl items-center`,
                          i > 0 && tw`ml-3`,
                          {
                            backgroundColor: active ? "#FFFFFF" : "#F9FAFB",
                            borderWidth: 1.5,
                            borderColor: active ? PRIMARY_COLOR : "#E5E7EB",
                          },
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <Text
                          style={[
                            tw`text-sm font-semibold`,
                            { color: active ? PRIMARY_COLOR : "#4B5563" },
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <ReadOnlyBox value={form.gender} />
              )}
            </Field>

            <View style={tw`mb-0`}>
              <Field label="Country">
                {isEditing ? (
                  <CustomDropdown
                    placeholder={form.country || "Select country"}
                    onChange={(val: { name: string }) =>
                      update({ country: val.name })
                    }
                  />
                ) : (
                  <ReadOnlyBox value={form.country} />
                )}
              </Field>
            </View>
          </View>

          <View style={tw`mt-6`}>
            {isEditing ? (
              <View style={tw`flex-row items-center`}>
                <TouchableOpacity
                  onPress={handleCancel}
                  disabled={saving}
                  activeOpacity={0.8}
                  style={[
                    tw`flex-1 py-3.5 rounded-xl items-center justify-center mr-3`,
                    {
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      backgroundColor: "#FFFFFF",
                    },
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={tw`text-gray-700 font-semibold text-sm`}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <View style={tw`flex-1`}>
                  <PrimaryBtn title={"Save changes"} onpressed={handleSave} />
                </View>
              </View>
            ) : (
              <PrimaryBtn
                title={"Edit profile"}
                onpressed={() => setIsEditing(true)}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingModal visibility={saving} text="Saving changes…" />
    </SafeAreaView>
  );
};

export default ProfileScreen;
