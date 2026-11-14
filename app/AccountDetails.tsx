import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
// import * as Clipboard from "expo-clipboard";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import {
  selectAccessToken,
  selectExchange,
  selectReceiver,
} from "@/hooks/redux/slice";
import {
  BASE_URL,
  NumberFormatter,
  PRIMARY_COLOR,
  primePercent,
} from "@/hooks/api";
import CustomHeader from "@/components/common/CustomHeader";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import LoadingModal from "@/components/common/Modals/LoadingModal";

interface ExchangeState {
  from?: string;
  to?: string;
}

interface ReceiverInfo {
  account_name?: string;
  bank_name?: string;
  account_number?: string;
  sort_code?: string;
  payment_reason?: string;
  student_id?: string;
  iban?: string;
  swift_bic?: string;
  address?: string;
}

interface BankRow {
  key: string;
  label: string;
  value: string;
  highlight?: boolean;
}

interface BankDetails {
  flag: string;
  country: string;
  rows: BankRow[];
}

const BANKS: Record<"NG" | "UK", BankDetails> = {
  NG: {
    flag: "🇳🇬",
    country: "Nigeria",
    rows: [
      { key: "account", label: "Account number", value: "0499324419" },
      { key: "bank", label: "Bank name", value: "GT Bank" },
      { key: "name", label: "Account name", value: "Bamire Tolulope Stephen" },
      { key: "ref", label: "Reference", value: "Globees.ex", highlight: true },
    ],
  },
  UK: {
    flag: "🇬🇧",
    country: "United Kingdom",
    rows: [
      { key: "account", label: "Account number", value: "62412362" },
      { key: "sort", label: "Sort code", value: "30-92-33" },
      { key: "bank", label: "Bank name", value: "Lloyds Bank" },
      { key: "name", label: "Account name", value: "Bamire Tolulope" },
      { key: "ref", label: "Reference", value: "Globees.ex", highlight: true },
    ],
  },
};

const AccountDetails = () => {
  const params = useLocalSearchParams<{
    category?: string;
    currency_from?: string;
    currency_to?: string;
  }>();
  const exchange = useSelector(selectExchange) as ExchangeState | null;
  const account = useSelector(selectReceiver) as ReceiverInfo | null;
  const token = useSelector(selectAccessToken);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const type = params.category;
  const bank = BANKS[params.currency_from === "NGN" ? "NG" : "UK"];

  const from = exchange?.from ?? "";
  const amounted = from.substring(1);

  const amountFrom =
    type === "exchange"
      ? from
      : (from[0] ?? "") +
        NumberFormatter(
          Number(amounted) + Number(primePercent(Number(amounted)).toFixed(2)),
        );

  const transactionsData = {
    amountsend: amountFrom,
    amountreceive: exchange?.to,
    service_charge: (from[0] ?? "") + primePercent(Number(amounted)).toFixed(2),
    category: type,
    receiver_name: account?.account_name,
    bank_name: account?.bank_name,
    account_number: account?.account_number,
    sort_code: account?.sort_code,
    payment_reason: account?.payment_reason,
    studentId: account?.student_id,
    iban: account?.iban,
    swift_bic: account?.swift_bic,
    address: account?.address,
  };

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const copy = async (key: string, value: string) => {
    try {
      await Clipboard.setString(value);
      setCopiedKey(key);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedKey(null), 1500);
    } catch (error) {
      console.error("Copy to clipboard failed:", error);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/transactions`,
        transactionsData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        router.navigate({
          pathname: "/SuccessTransaction",
          params: { category: type },
        });
      } else {
        Alert.alert("Error", "There was an error processing the transaction");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "There was an error processing the transaction");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaid = () => {
    if (submitting) return;
    Alert.alert(
      "Confirm payment",
      `Have you already sent exactly ${amountFrom} from your bank account?`,
      [
        { text: "Not yet", style: "cancel" },
        { text: "Yes, I've paid", onPress: submit },
      ],
    );
  };

  const amountCopyValue = amountFrom.replace(/[^0-9.]/g, "");

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <CustomHeader title={"Globees Ex Bank Account"} />

        <Text style={tw`text-gray-500 text-sm leading-5 mt-4`}>
          Transfer the exact deposit amount to the account below, then tap PAID
          to continue.
        </Text>

        <View
          style={[tw`rounded-3xl p-6 mt-5`, { backgroundColor: PRIMARY_COLOR }]}
        >
          <Text style={tw`text-white/70 text-xs`}>Amount to deposit</Text>
          <View style={tw`flex-row items-center justify-between mt-1`}>
            <Text
              style={tw`flex-1 text-white font-bold text-3xl`}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {amountFrom}
            </Text>
            <TouchableOpacity
              onPress={() => copy("amount", amountCopyValue)}
              activeOpacity={0.7}
              style={tw`w-10 h-10 rounded-full bg-white/20 items-center justify-center ml-3`}
              accessibilityRole="button"
              accessibilityLabel="Copy amount"
            >
              <Icon
                name={copiedKey === "amount" ? "checkmark" : "copy-outline"}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
          <Text style={tw`text-white/70 text-xs mt-2`}>
            Send this exact amount
          </Text>
        </View>

        <View style={tw`flex-row items-center mt-6 mb-2 ml-1`}>
          <Text style={tw`text-base mr-2`}>{bank.flag}</Text>
          <Text style={tw`text-gray-500 text-xs font-semibold`}>
            Send to · {bank.country}
          </Text>
        </View>

        <View
          style={tw`bg-white rounded-2xl border border-gray-100 overflow-hidden`}
        >
          {bank.rows.map((row, i) => {
            const copied = copiedKey === row.key;
            return (
              <TouchableOpacity
                key={row.key}
                activeOpacity={0.7}
                onPress={() => copy(row.key, row.value)}
                style={[
                  tw`flex-row items-center px-4 py-3.5`,
                  i > 0 && tw`border-t border-gray-100`,
                  row.highlight && { backgroundColor: "#FFFBEB" },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Copy ${row.label}`}
              >
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-500 text-xs`}>
                    {row.label}
                    {row.highlight ? " · required" : ""}
                  </Text>
                  <Text
                    style={tw`text-gray-900 text-base font-semibold mt-0.5`}
                  >
                    {row.value}
                  </Text>
                </View>
                <Icon
                  name={copied ? "checkmark-circle" : "copy-outline"}
                  size={20}
                  color={copied ? "#059669" : PRIMARY_COLOR}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={[
            tw`flex-row items-start rounded-2xl p-4 mt-6`,
            {
              backgroundColor: "#FEF2F2",
              borderWidth: 1,
              borderColor: "#FECACA",
            },
          ]}
        >
          <Icon name="alert-circle-outline" size={18} color="#B91C1C" />
          <Text style={tw`flex-1 text-gray-700 text-xs leading-4 ml-3`}>
            Only tap PAID after the payment has left your bank account. Send the
            exact amount with the reference above so it's processed instantly.
            Otherwise, your payment will be automatically cancelled.
          </Text>
        </View>
      </ScrollView>

      <View style={tw`px-5 pt-4 pb-3 bg-white border-t border-gray-100`}>
        <PrimaryBtn onpressed={handlePaid} title={"PAID"} />
      </View>

      <LoadingModal text={"Processing…"} visibility={submitting} />
    </SafeAreaView>
  );
};

export default AccountDetails;
