import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  selectAccessToken,
  selectExchange,
  selectRates,
  selectReceiver,
  selectUserProfile,
  setCryptoData,
} from "@/hooks/redux/slice";
import { usePushNotification } from "@/usePushNotification";
import { NumberFormatter, primePercent } from "@/hooks/api";
import { router, useLocalSearchParams } from "expo-router";
import Icon from "@expo/vector-icons/Ionicons";
import CustomHeader from "@/components/common/CustomHeader";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import LoadingModal from "@/components/common/Modals/LoadingModal";
import { AmountFormatter } from "@/hooks/lib/formatter";

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const SummaryScreen = () => {
  const params = useLocalSearchParams();
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const exchangeed = useSelector(selectExchange);
  const typeR = params.category;
  const currency_from = params.currency_from;
  const currency_to = params.currency_to;
  const accountD = useSelector(selectReceiver);
  const key = useSelector(selectAccessToken);
  const usersP = useSelector(selectUserProfile);
  const rates = useSelector(selectRates);

  const { expoPushToken } = usePushNotification();
  let amounted = exchangeed?.from.substring(1);
  // console.log(currency_from)
  // console.log(currency_to)
  let rated =
    currency_from == "BTC"
      ? rates.find((rate: { name: string }) => rate.name === "BTC - Crypto")
      : currency_from == "ETH"
        ? rates.find((rate: { name: string }) => rate.name === "ETH - Crypto")
        : rates.find((rate: { name: string }) => rate.name === "USDT - Crypto");

  useEffect(() => {
    setPush();
  }, []);

  const amountfrom =
    typeR == "exchange"
      ? exchangeed?.from
      : typeR == "crypto"
        ? Number(exchangeed?.from) * rated?.amount
        : exchangeed?.from[0] +
          NumberFormatter(
            Number(exchangeed?.from.substring(1)) +
              primePercent(exchangeed?.from.substring(1)),
          );

  const setPush = async () => {
    if (expoPushToken?.data) {
      await AsyncStorage.setItem("pushToken", expoPushToken?.data);
    }
  };

  let transactionsData = {
    amountsend: `${exchangeed?.to} ${currency_from}`,
    amountreceive: amountfrom,
    service_charge: "0",
    category: typeR,
    receiver_name: accountD?.account_name,
    bank_name: accountD?.bank_name,
    account_number: accountD?.account_number,
    sort_code: accountD?.sort_code,
    payment_reason: accountD?.payment_reason,
    studentId: accountD?.student_id,
    iban: accountD?.iban,
    swift_bic: accountD?.swift_bic,
  };

  const handleContinue = () => {
    if (typeR == "crypto") {
      dispatch(setCryptoData(transactionsData));
      router.navigate({
        pathname: "/CryptoSuccessPage",
        params: {
          category: typeR,
          currency_from: currency_from,
          currency_to: currency_to,
        },
      });
    } else {
      router.navigate({
        pathname: "/AccountDetails",
        params: {
          category: typeR,
          currency_from: currency_from,
          currency_to: currency_to,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader title={"Summary Details"} />

        <Text style={styles.subtitle}>
          Kindly review the {typeR} information provided and continue to make a
          deposit.
        </Text>

        <View style={styles.card}>
          <Row label="Category" value={<Text style={styles.cap}>{typeR}</Text>} />

          <Row
            label="Send"
            value={
              typeR == "crypto" ? (
                <>
                  {exchangeed?.to} {currency_from}
                </>
              ) : (
                <>{AmountFormatter(amountfrom)}</>
              )
            }
          />

          <Row
            label="Receive"
            value={
              typeR == "crypto" ? (
                <>NGN{AmountFormatter(amountfrom as string)}</>
              ) : (
                <>
                  {" "}
                  {currency_to == "UK" && typeR !== "exchange"
                    ? "GBP"
                    : currency_to == "NGN" && typeR == "exchange"
                      ? ""
                      : currency_to !== "" && typeR !== "exchange"
                        ? currency_to
                        : ""}{" "}
                  {AmountFormatter(exchangeed?.to)}{" "}
                </>
              )
            }
          />

          <Row label="Recipient Name" value={accountD?.account_name} />
          <Row label="Bank Name" value={accountD?.bank_name} />
          <Row label="Account Number" value={accountD?.account_number} />

          {typeR !== "exchange" && typeR !== "crypto" && (
            <Row label="Payment Reason" value={accountD?.payment_reason} />
          )}

          {typeR == "exchange" && currency_to == "UK" && (
            <Row
              label="Sort Code"
              value={accountD?.sort_code !== "" ? accountD?.sort_code : "N/A"}
            />
          )}

          {typeR !== "exchange" &&
            currency_to !== "UK" &&
            currency_to !== "EUR" &&
            currency_from == "NGN" &&
            typeR !== "crypto" && (
              <View style={styles.group}>
                <Row
                  label="Sort Code"
                  value={
                    accountD?.sort_code !== "" ? accountD?.sort_code : "N/A"
                  }
                />
                <Row label="Iban" value={accountD?.iban} />
                <Row label="Swift Bic" value={accountD?.swift_bic} />
                <Row label="Address" value={accountD?.address} />
              </View>
            )}

          {accountD?.student_id !== "" && (
            <Row label="Student ID" value={accountD?.student_id} />
          )}
        </View>

        <View style={styles.cta}>
          <PrimaryBtn onpressed={handleContinue} title={"Continue"} />
          <View style={styles.warning}>
            <Icon name="alert-circle-outline" size={16} color="#B91C1C" />
            <Text style={styles.warningText}>
              Ensure all the information provided are accurate to avoid payment
              cancellation.
            </Text>
          </View>
        </View>
      </ScrollView>

      <LoadingModal text={"Loading..."} visibility={modal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  subtitle: {
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 20,
  },

  card: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    padding: 18,
    gap: 14,
    backgroundColor: "#FFFFFF",
  },
  group: { gap: 14 },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  rowLabel: { color: "#6b7280", fontSize: 13 },
  rowValue: {
    flex: 1,
    textAlign: "right",
    marginLeft: 16,
    color: "#111827",
    fontSize: 13.5,
    fontWeight: "600",
  },
  cap: { textTransform: "capitalize" },

  cta: { marginTop: 28 },

  warning: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  warningText: {
    flex: 1,
    color: "#B91C1C",
    fontSize: 12,
    lineHeight: 17,
  },
});

export default SummaryScreen;
