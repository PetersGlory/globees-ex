import React from "react";
import { View, Text, Modal, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { PRIMARY_COLOR } from "@/hooks/api";

interface LoadingModalProps {
  visibility: boolean;
  setVisibility?: (visibility: boolean) => void;
  message?: string;
  text?: string;
  isloading?: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  visibility,
  setVisibility,
  message,
  text = "Please wait…",
  isloading = true,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      statusBarTranslucent
      visible={visibility}
      onRequestClose={() => setVisibility?.(false)}
    >
      <View
        style={[
          tw`flex-1 items-center justify-center px-10`,
          { backgroundColor: "rgba(15, 23, 42, 0.45)" },
        ]}
      >
        <View
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={[
            tw`bg-white rounded-3xl px-8 py-7 items-center`,
            {
              minWidth: 180,
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.15,
              shadowRadius: 24,
              elevation: 12,
            },
          ]}
        >
          {isloading && (
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          )}
          <Text
            style={[
              tw`text-gray-800 text-sm font-medium text-center`,
              isloading && tw`mt-4`,
            ]}
          >
            {message ?? text}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
