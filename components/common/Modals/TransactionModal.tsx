import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  type ViewInstance,
} from "react-native";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shareAsync } from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { selectUserProfile } from "@/hooks/redux/slice";
import { NumberFormatter, PRIMARY_COLOR } from "@/hooks/api";
import { AmountFormatter } from "@/hooks/lib/formatter";

interface TransactionModalProps {
  onpressed: () => void;
  visibility: boolean;
  data: any;
}

type StatusKind = "success" | "pending" | "failed";

const STATUS_STYLES: Record<
  StatusKind,
  {
    color: string;
    bg: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
  }
> = {
  success: { color: "#047857", bg: "#ECFDF5", icon: "checkmark-circle" },
  pending: { color: "#B45309", bg: "#FFFBEB", icon: "time" },
  failed: { color: "#B91C1C", bg: "#FEF2F2", icon: "close-circle" },
};

const getStatusKind = (status?: string): StatusKind => {
  const value = (status ?? "").toLowerCase();
  if (value === "success" || value === "successful" || value === "completed")
    return "success";
  if (value === "pending" || value === "processing" || value === "initiated")
    return "pending";
  return "failed";
};

const capitalize = (value?: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";

const formatDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (isNaN(date.getTime())) return undefined;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DashedDivider = () => (
  <View style={{ height: 1, overflow: "hidden", marginVertical: 20 }}>
    <View
      style={{
        height: 2,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#D1D5DB",
        borderRadius: 1,
        marginTop: -1,
      }}
    />
  </View>
);

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <View style={tw`flex-row items-start justify-between py-2`}>
      <Text style={tw`text-gray-500 text-sm mr-4`}>{label}</Text>
      <Text
        style={tw`flex-1 text-gray-900 text-sm font-medium text-right`}
        selectable
      >
        {value}
      </Text>
    </View>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={tw`mb-2`}>
    <Text style={tw`text-gray-900 font-semibold text-sm mb-1`}>{title}</Text>
    {children}
  </View>
);

const TransactionModal: React.FC<TransactionModalProps> = ({
  onpressed,
  visibility,
  data,
}) => {
  const usersProfile = useSelector(selectUserProfile) as {
    fullname?: string;
  } | null;
  const insets = useSafeAreaInsets();
  const receiptRef = useRef<ViewInstance>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (!receiptRef.current || sharing) return;
    setSharing(true);
    try {
      const uri = await captureRef(receiptRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });
      await shareAsync(uri, {
        UTI: "public.png",
        mimeType: "image/png",
        dialogTitle: "Share transaction receipt",
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Couldn't share receipt", "Please try again.");
    } finally {
      setSharing(false);
    }
  }, [sharing]);

  const statusKind = getStatusKind(data?.status);
  const status = STATUS_STYLES[statusKind];
  const isCrypto = data?.category === "crypto";
  const isExchange = data?.category === "exchange";

  const received =
    data?.amountreceive === undefined || data?.amountreceive === null
      ? undefined
      : isCrypto
        ? AmountFormatter(data.amountreceive as string)
        : data.amountreceive;

  return (
    <Modal
      animationType="slide"
      transparent
      statusBarTranslucent
      visible={visibility}
      onRequestClose={onpressed}
      onDismiss={onpressed}
    >
      <View
        style={[
          tw`flex-1 justify-end`,
          { backgroundColor: "rgba(15, 23, 42, 0.55)" },
        ]}
      >
        <Pressable
          style={tw`absolute inset-0`}
          onPress={onpressed}
          accessibilityLabel="Close receipt"
        />

        <View
          style={[
            tw`bg-white rounded-t-3xl overflow-hidden`,
            { maxHeight: "92%" },
          ]}
        >
          <View style={tw`items-center pt-3 pb-1`}>
            <View style={tw`w-10 h-1 rounded-full bg-gray-300`} />
          </View>

          <ScrollView
            style={{ flexGrow: 0, flexShrink: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`pb-2`}
          >
            <View
              ref={receiptRef}
              collapsable={false}
              style={tw`bg-white px-6 pt-4 pb-6`}
            >
              <View style={tw`flex-row items-center justify-center`}>
                <Image
                  source={require("../../../assets/images/logo-bg.png")}
                  style={tw`w-10 h-10 rounded-full mr-3`}
                />
                <View>
                  <Text style={tw`text-gray-900 font-bold text-base`}>
                    Globees Ex
                  </Text>
                  <Text style={tw`text-gray-500 text-xs`}>
                    Transaction receipt
                  </Text>
                </View>
              </View>

              <View style={tw`items-center mt-7`}>
                <Text style={tw`text-gray-500 text-xs`}>Amount sent</Text>
                <Text style={tw`text-gray-900 font-bold text-3xl mt-1`}>
                  {AmountFormatter(data?.amountsend)}
                </Text>
                <View
                  style={[
                    tw`flex-row items-center px-3 py-1.5 rounded-full mt-3`,
                    { backgroundColor: status.bg },
                  ]}
                >
                  <Ionicons name={status.icon} size={16} color={status.color} />
                  <Text
                    style={[
                      tw`text-sm font-semibold ml-1.5`,
                      { color: status.color },
                    ]}
                  >
                    {capitalize(data?.status)}
                  </Text>
                </View>
              </View>

              <DashedDivider />

              <Section title="Summary">
                <DetailRow label="Transaction ID" value={data?.id ?? "N/A"} />
                <DetailRow label="Date" value={formatDate(data?.created_at)} />
                <DetailRow label="Type" value={capitalize(data?.category)} />
                <DetailRow label="From" value={usersProfile?.fullname} />
                <DetailRow label="To" value="Globees Ex" />
                <DetailRow label="Recipient gets" value={received} />
              </Section>

              <DashedDivider />

              <Section title="Recipient">
                <DetailRow
                  label="Name"
                  value={data?.receiver_name?.toUpperCase()}
                />
                <DetailRow
                  label="Bank"
                  value={data?.bank_name?.toUpperCase()}
                />
                <DetailRow
                  label="Account number"
                  value={data?.account_number}
                />
              </Section>

              {!isExchange && !isCrypto && (
                <>
                  <DashedDivider />
                  <Section title="Payment details">
                    <DetailRow
                      label="Reason"
                      value={data?.payment_reason?.toUpperCase()}
                    />
                    <DetailRow
                      label="Student ID"
                      value={data?.student_id || "N/A"}
                    />
                    <DetailRow label="IBAN" value={data?.iban || "N/A"} />
                    <DetailRow
                      label="Swift/BIC"
                      value={data?.swift_bic || "N/A"}
                    />
                  </Section>
                </>
              )}

              <View style={tw`items-center mt-6`}>
                <Text style={tw`text-gray-500 text-xs`}>
                  Thank you for using Globees Ex
                </Text>
                <Text style={tw`text-gray-400 text-xs mt-0.5`}>
                  This is an official receipt
                </Text>
              </View>
            </View>
          </ScrollView>

          <View
            style={[
              tw`flex-row px-6 pt-4 border-t border-gray-100 bg-white`,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            <TouchableOpacity
              onPress={onpressed}
              activeOpacity={0.8}
              style={[
                tw`flex-1 py-3.5 rounded-xl items-center justify-center mr-3`,
                { borderWidth: 1, borderColor: PRIMARY_COLOR },
              ]}
              accessibilityRole="button"
            >
              <Text
                style={[tw`font-semibold text-sm`, { color: PRIMARY_COLOR }]}
              >
                Close
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              disabled={sharing}
              activeOpacity={0.85}
              style={[
                tw`flex-1 py-3.5 rounded-xl flex-row items-center justify-center`,
                { backgroundColor: PRIMARY_COLOR, opacity: sharing ? 0.7 : 1 },
              ]}
              accessibilityRole="button"
            >
              {sharing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={tw`text-white font-semibold text-sm ml-2`}>
                    Share receipt
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionModal;
