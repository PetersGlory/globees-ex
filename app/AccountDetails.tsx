import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Clipboard,
  Platform,
} from "react-native";
import tw from "twrnc";
import { useState } from "react";
import Icon from "@expo/vector-icons/Ionicons";
import { Alert } from "react-native";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken, selectExchange, selectReceiver, selectUserProfile } from "@/hooks/redux/slice";
import { BASE_URL, NumberFormatter, PRIMARY_COLOR, primePercent } from "@/hooks/api/Index";
import { router, useLocalSearchParams } from "expo-router";
import CustomHeader from "@/components/common/CustomHeader";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import LoadingModal from "@/components/common/Modals/LoadingModal";

const AccountDetails = () => {
  const params = useLocalSearchParams();
  const [country, setCountry] = useState("NG");
  const [modal, setModal] = useState(false);
  const exchangeed = useSelector(selectExchange);
  const typeR = params.category;
  const currency_from = params.currency_from;
  const currency_to = params.currency_to;
  const accountD = useSelector(selectReceiver);
  const key = useSelector(selectAccessToken);
  const usersP = useSelector(selectUserProfile);

  let amounted = exchangeed.from.substring(1);

  const amountfrom =
    typeR == "exchange"
      ? exchangeed?.from
      : exchangeed?.from[0] +
        NumberFormatter(
            Number(exchangeed?.from.substring(1)) +
              Number(primePercent(amounted).toFixed(2))
        );

  let transactionsData = {
    amountsend: amountfrom,
    amountreceive: exchangeed?.to,
    service_charge:
      exchangeed?.from[0] + primePercent(Number(amounted)).toFixed(2),
    category: typeR,
    receiver_name: accountD?.account_name,
    bank_name: accountD?.bank_name,
    account_number: accountD?.account_number,
    sort_code: accountD?.sort_code,
    payment_reason: accountD?.payment_reason,
    studentId: accountD?.student_id,
    iban: accountD?.iban,
    swift_bic: accountD?.swift_bic,
    address: accountD?.address,
  };

  useEffect(() => {
    if (currency_from == "NGN") {
      setCountry("NG");
    } else {
      setCountry("UK");
    }
  }, []);

  // Copying to clip board function
  const copyToClipboard = async (text:any) => {
    try {
      await Clipboard.setString(text);
      alert("Account Number copied to clipboard!");
    } catch (error) {
      console.error("Copy to clipboard failed: ", error);
    }
  };

  // Submit button
  const handleContinue = async () => {
    setModal(true);
    const responsed = await axios.post(
      `${BASE_URL}/transactions`,
      transactionsData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
      }
    );

    if (responsed.status === 200 || responsed.status === 201) {
      setTimeout(() => {
        setModal(false);
        router.navigate({
          pathname: "/SuccessTransaction",
          params:{
            category: typeR,
          }
        });
        // sendpush(typeR, `Howdy ${usersP?.fullname}, Your ${typeR} will arrive in minutes. Thank you for your business with Globees Ex.`,key);
      }, 500);
    } else {
      setTimeout(() => {
        setModal(false);
        Alert.alert("Error", "There was an error processing the transaction");
      }, 500);
    }
  };
  return (
    <SafeAreaView style={tw`flex-grow bg-white p-5 pt-10`}>
      <StatusBar style="dark" />
      <View
        style={tw`w-full h-full ${Platform.OS == "ios" ? "p-5 w-full h-full" :""}`}
      >
        <CustomHeader title={"Account Details"} />

        <Text style={tw`text-center text-gray-500 mt-5 text-[12px]`}>
          Kindly transfer the exact amount to our bank account details below to
          continue.
        </Text>

        <View style={tw`w-full mt-5`}>
          {/* Tabs */}
          <View style={tw`flex flex-row items-center justify-between`}>
            {currency_from == "NGN" ? (
              <TouchableOpacity
                style={tw`items-center flex-1 p-2 ${
                  country == "NG" ? "border-b border-blue-800" : ""
                }`}
                onPress={() => {
                  setCountry("NG");
                }}
              >
                <Text style={tw`text-gray-700 text-[15px]`}>🇳🇬 Nigeria</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={tw`items-center flex-1 p-2 ${
                  country == "UK" ? "border-b border-blue-800" : ""
                }`}
                onPress={() => {
                  setCountry("UK");
                }}
              >
                <Text style={tw`text-gray-700 text-[15px]`}>
                  🇬🇧 United Kingdom
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {country == "NG" ? (
            <View style={tw`bg-white rounded-lg p-5 mt-5`}>
              <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                Account Number:{" "}
                <Text style={tw`text-blue-800 font-medium`}>0499324419</Text>{" "}
                <Icon
                  name="copy-outline"
                  onPress={() => copyToClipboard("")}
                  size={20}
                  color={PRIMARY_COLOR}
                />{" "}
              </Text>
              <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                Bank Name:{" "}
                <Text style={tw`text-blue-800 font-medium`}>GT bank</Text>{" "}
                <Icon
                  name="copy-outline"
                  onPress={() => copyToClipboard("")}
                  size={20}
                  color={PRIMARY_COLOR}
                />{" "}
              </Text>
              <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                Account Name:{" "}
                <Text style={tw`text-blue-800 font-medium`}>
                  Bamire Tolulope Stephen
                </Text>{" "}
                <Icon
                  name="copy-outline"
                  onPress={() => copyToClipboard("")}
                  size={20}
                  color={PRIMARY_COLOR}
                />{" "}
              </Text>

              <View style={tw`mt-4`}>
                <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                  NOTE: Reference as {" "}
                  <Text style={tw`text-blue-800 font-medium`}>Globees.ex</Text>{" "}
                  <Icon
                    name="copy-outline"
                    onPress={() => copyToClipboard("")}
                    size={20}
                    color={PRIMARY_COLOR}
                  />{" "}
                </Text>
              </View>
            </View>
          ) : (
            <View style={tw`bg-white rounded-lg p-5 mt-5`}>
              <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                Account Number:{" "}
                <Text style={tw`text-blue-800 font-medium`}>62412362</Text>{" "}
                <Icon
                  name="copy-outline"
                  onPress={() => copyToClipboard("")}
                  size={20}
                  color={PRIMARY_COLOR}
                />{" "}
              </Text>
              <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                Sort Code:{" "}
                <Text style={tw`text-blue-800 font-medium`}>30-92-33</Text>{" "}
                <Icon
                  name="copy-outline"
                  onPress={() => copyToClipboard("")}
                  size={20}
                  color={PRIMARY_COLOR}
                />{" "}
              </Text>
              <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                Bank Name:{" "}
                <Text style={tw`text-blue-800 font-medium`}>Lloyds Bank</Text>{" "}
                <Icon
                  name="copy-outline"
                  onPress={() => copyToClipboard("")}
                  size={20}
                  color={PRIMARY_COLOR}
                />{" "}
              </Text>
              <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                Account Name:{" "}
                <Text style={tw`text-blue-800 font-medium`}>
                  Bamire Tolulope
                </Text>{" "}
                <Icon
                  name="copy-outline"
                  onPress={() => copyToClipboard("")}
                  size={20}
                  color={PRIMARY_COLOR}
                />{" "}
              </Text>

              <View style={tw`mt-4`}>
                <Text style={tw`text-[13px] text-gray-800 mt-2`}>
                  NOTE: Reference as {" "}
                  <Text style={tw`text-blue-800 font-medium`}>Globees.ex</Text>{" "}
                  <Icon
                    name="copy-outline"
                    onPress={() => copyToClipboard("")}
                    size={20}
                    color={PRIMARY_COLOR}
                  />{" "}
                </Text>
              </View>
            </View>
          )}

          <View style={tw`mt-5 w-full`}>
            <PrimaryBtn onpressed={handleContinue} title={"PAID"} />
            <Text style={tw`mt-3 text-[12px] text-gray-600`}>
              Note: Do not click paid if the payment has not been sent from your
              bank. Ensure to send the exact amount required to process your
              payment instantly.
            </Text>
          </View>
        </View>
      </View>
      <View style={tw`w-full items-center justify-center flex flex-col`}>
        <LoadingModal
          message={"Loading..."}
          isloading={true}
          visibility={modal}
          setVisibility={setModal}
        />
      </View>
    </SafeAreaView>
  );
};

export default AccountDetails;
