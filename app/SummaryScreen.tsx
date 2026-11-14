import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectExchange,
  selectRates,
  selectReceiver,
  setCryptoData,
} from "@/hooks/redux/slice";
import { usePushNotification } from "@/usePushNotification";
import { NumberFormatter, PRIMARY_COLOR, primePercent } from "@/hooks/api";
import { AmountFormatter } from "@/hooks/lib/formatter";
import CustomHeader from "@/components/common/CustomHeader";
import PrimaryBtn from "@/components/common/PrimaryBtn";

interface Rate {
  name?: string;
  amount?: string | number;
}

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

interface DetailRow {
  label: string;
  value?: string | number | null;
}

const RATE_NAMES: Record<string, string> = {
  BTC: "BTC - Crypto",
  ETH: "ETH - Crypto",
  USDT: "USDT - Crypto",
};

const capitalize = (value?: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

const Section = ({ title, rows }: { title: string; rows: DetailRow[] }) => {
  const visible = rows.filter(
    (row) => row.value !== undefined && row.value !== null && row.value !== "",
  );
  if (visible.length === 0) return null;

  return (
    <View style={tw`mt-6`}>
      <Text style={tw`text-gray-500 text-xs font-semibold mb-2 ml-1`}>
        {title}
      </Text>
      <View
        style={tw`bg-white rounded-2xl border border-gray-100 overflow-hidden`}
      >
        {visible.map((row, i) => (
          <View
            key={row.label}
            style={[
              tw`flex-row items-start justify-between px-4 py-3.5`,
              i > 0 && tw`border-t border-gray-100`,
            ]}
          >
            <Text style={tw`text-gray-500 text-sm`}>{row.label}</Text>
            <Text
              style={tw`flex-1 text-gray-900 text-sm font-medium text-right ml-4`}
              selectable
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const SummaryScreen = () => {
  const params = useLocalSearchParams<{
    category?: string;
    currency_from?: string;
    currency_to?: string;
  }>();
  const dispatch = useDispatch();
  const exchange = useSelector(selectExchange) as ExchangeState | null;
  const account = useSelector(selectReceiver) as ReceiverInfo | null;
  const rates = useSelector(selectRates) as Rate[] | null | undefined;
  const { expoPushToken } = usePushNotification();

  const type = params.category;
  const currencyFrom = params.currency_from;
  const currencyTo = params.currency_to;

  const isExchange = type === "exchange";
  const isCrypto = type === "crypto";

  const rate = rates?.find(
    (r) => r.name === (RATE_NAMES[currencyFrom ?? ""] ?? RATE_NAMES.USDT),
  );

  useEffect(() => {
    if (expoPushToken?.data) {
      AsyncStorage.setItem("pushToken", expoPushToken.data);
    }
  }, [expoPushToken?.data]);

  const from = exchange?.from ?? "";

  const amountFrom: string | number = isExchange
    ? from
    : isCrypto
      ? Number(from) * Number(rate?.amount)
      : (from[0] ?? "") +
        NumberFormatter(
          Number(from.substring(1)) + primePercent(Number(from.substring(1))),
        );

  const receiveCurrency =
    currencyTo === "UK" && !isExchange
      ? "GBP"
      : currencyTo === "NGN" && isExchange
        ? ""
        : currencyTo !== "" && !isExchange
          ? currencyTo
          : "";

  const sendText = isCrypto
    ? `${exchange?.to} ${currencyFrom}`
    : AmountFormatter(amountFrom as string);

  const receiveText = isCrypto
    ? `NGN ${AmountFormatter(amountFrom as string)}`
    : `${receiveCurrency ?? ""} ${AmountFormatter(exchange?.to as string)}`.trim();

  const showIntlDetails =
    !isExchange &&
    !isCrypto &&
    currencyTo !== "UK" &&
    currencyTo !== "EUR" &&
    currencyFrom === "NGN";

  const transferRows: DetailRow[] = [
    { label: "Category", value: capitalize(type) },
    {
      label: "Rate",
      value:
        isCrypto && rate?.amount
          ? `$1 = ₦${NumberFormatter(Number(rate.amount))}`
          : undefined,
    },
  ];

  const recipientRows: DetailRow[] = [
    { label: "Recipient name", value: account?.account_name },
    { label: "Bank name", value: account?.bank_name },
    { label: "Account number", value: account?.account_number },
    {
      label: "Payment reason",
      value: !isExchange && !isCrypto ? account?.payment_reason : undefined,
    },
    {
      label: "Sort code",
      value:
        (isExchange && currencyTo === "UK") || showIntlDetails
          ? account?.sort_code || "N/A"
          : undefined,
    },
    { label: "IBAN", value: showIntlDetails ? account?.iban : undefined },
    {
      label: "Swift/BIC",
      value: showIntlDetails ? account?.swift_bic : undefined,
    },
    { label: "Address", value: showIntlDetails ? account?.address : undefined },
    { label: "Student ID", value: account?.student_id },
  ];

  const handleContinue = () => {
    const pathParams = {
      category: type,
      currency_from: currencyFrom,
      currency_to: currencyTo,
    };

    if (isCrypto) {
      dispatch(
        setCryptoData({
          amountsend: `${exchange?.to} ${currencyFrom}`,
          amountreceive: amountFrom,
          service_charge: "0",
          category: type,
          receiver_name: account?.account_name,
          bank_name: account?.bank_name,
          account_number: account?.account_number,
          sort_code: account?.sort_code,
          payment_reason: account?.payment_reason,
          studentId: account?.student_id,
          iban: account?.iban,
          swift_bic: account?.swift_bic,
        }),
      );
      router.navigate({ pathname: "/CryptoSuccessPage", params: pathParams });
    } else {
      router.navigate({ pathname: "/AccountDetails", params: pathParams });
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <CustomHeader title={"Summary Details"} />

        <Text style={tw`text-gray-500 text-sm leading-5 mt-4`}>
          Review your {type} details below, then continue to make a deposit.
        </Text>

        <View
          style={[tw`rounded-3xl p-6 mt-5`, { backgroundColor: PRIMARY_COLOR }]}
        >
          <Text style={tw`text-white/70 text-xs`}>You send</Text>
          <Text
            style={tw`text-white font-bold text-2xl mt-1`}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {sendText}
          </Text>

          <View style={tw`flex-row items-center my-4`}>
            <View style={tw`flex-1 h-px bg-white/20`} />
            <View
              style={tw`w-8 h-8 rounded-full bg-white/20 items-center justify-center mx-3`}
            >
              <Icon name="arrow-down" size={16} color="#FFFFFF" />
            </View>
            <View style={tw`flex-1 h-px bg-white/20`} />
          </View>

          <Text style={tw`text-white/70 text-xs`}>Recipient gets</Text>
          <Text
            style={tw`text-white font-bold text-2xl mt-1`}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {receiveText}
          </Text>
        </View>

        <Section title="Transfer" rows={transferRows} />
        <Section title="Recipient" rows={recipientRows} />

        <View
          style={[
            tw`flex-row items-start rounded-2xl p-4 mt-6`,
            {
              backgroundColor: "#FFFBEB",
              borderWidth: 1,
              borderColor: "#FDE68A",
            },
          ]}
        >
          <Icon name="alert-circle-outline" size={18} color="#B45309" />
          <Text style={tw`flex-1 text-gray-700 text-xs leading-4 ml-3`}>
            Make sure all the information provided is accurate to avoid payment
            cancellation.
          </Text>
        </View>
      </ScrollView>

      <View style={tw`px-5 pt-4 pb-3 bg-white border-t border-gray-100`}>
        <PrimaryBtn onpressed={handleContinue} title={"Continue"} />
      </View>
    </SafeAreaView>
  );
};

export default SummaryScreen;
