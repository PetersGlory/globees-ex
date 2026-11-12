import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SelectList } from "react-native-dropdown-select-list";
import { useDispatch } from "react-redux";
import { setReceiver } from "@/hooks/redux/slice";
import CustomHeader from "@/components/common/CustomHeader";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import LogOutModal from "@/components/common/Modals/LogOutModal";
import { router, useLocalSearchParams } from "expo-router";
import { PRIMARY_COLOR } from "@/hooks/api";

type InputProps = React.ComponentProps<typeof TextInput> & {
  focused?: boolean;
};

const Input = ({ focused, style, ...rest }: InputProps) => (
  <TextInput
    placeholderTextColor="#9ca3af"
    style={[styles.input, focused && styles.inputFocused, style]}
    {...rest}
  />
);

const ReceiverScreen = () => {
  const params = useLocalSearchParams();
  const [selected, setSelected] = useState("");
  const typeR = params.request_type;
  const currency_from = params.currency_from;
  const currency_to = params.currency_to;
  const [enabled, setEnabled] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState({
    account_name: "",
    bank_name: "",
    account_number: "",
    sort_code: "",
    payment_reason: "",
    student_id: "",
    iban: "",
    swift_bic: "",
    address: "",
  });

  const data = [
    { key: "2", value: "Tuition fees" },
    { key: "3", value: "Online purchases" },
    { key: "4", value: "Online payment" },
    { key: "5", value: "Others" },
  ];

  const handleSelectTo = (val: any) => {
    setSelected(val);
    setAccounts({
      ...accounts,
      payment_reason: val,
    });
  };

  const handleContinue = () => {
    setEnabled(false);
    if (
      accounts.account_name !== "" &&
      accounts.bank_name !== "" &&
      accounts.account_number !== ""
    ) {
      dispatch(setReceiver(accounts));
      router.push({
        pathname: "/SummaryScreen",
        params: {
          category: typeR,
          currency_from: currency_from,
          currency_to: currency_to,
        },
      });
    } else {
      alert("All fields are required.");
    }
  };
  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader title={"Receivers Information"} />

        <Text style={styles.subtitle}>
          Enter the receiver's bank account details here to continue.
        </Text>

        <View style={styles.form}>
          <Input
            placeholder="Recipient Name"
            value={accounts.account_name}
            onChangeText={(val) => {
              setAccounts({
                ...accounts,
                account_name: val,
              });
            }}
            keyboardType="default"
            focused={focused === "account_name"}
            onFocus={() => setFocused("account_name")}
            onBlur={() => setFocused(null)}
          />
          <Input
            placeholder="Bank Name"
            value={accounts.bank_name}
            onChangeText={(val) => {
              setAccounts({
                ...accounts,
                bank_name: val,
              });
            }}
            keyboardType="default"
            focused={focused === "bank_name"}
            onFocus={() => setFocused("bank_name")}
            onBlur={() => setFocused(null)}
          />
          <Input
            placeholder="Account Number"
            value={accounts.account_number}
            onChangeText={(val) => {
              setAccounts({
                ...accounts,
                account_number: val,
              });
            }}
            keyboardType="number-pad"
            focused={focused === "account_number"}
            onFocus={() => setFocused("account_number")}
            onBlur={() => setFocused(null)}
          />
          {(currency_to == "EUR" && typeR == "payment") ||
            (currency_to == "UK" && typeR == "payment") ||
            (currency_to == "UK" && typeR == "exchange" && (
              <Input
                placeholder="Sort Code"
                value={accounts.sort_code}
                onChangeText={(val) => {
                  setAccounts({
                    ...accounts,
                    sort_code: val,
                  });
                }}
                keyboardType="number-pad"
                maxLength={6}
                focused={focused === "sort_code"}
                onFocus={() => setFocused("sort_code")}
                onBlur={() => setFocused(null)}
              />
            ))}

          {typeR !== "exchange" && typeR !== "crypto" && (
            <View style={styles.group}>
              <SelectList
                setSelected={(val: any) => {
                  handleSelectTo(val);
                }}
                placeholder="Reason for payment"
                boxStyles={selectBox}
                dropdownStyles={selectDropdown}
                dropdownTextStyles={selectDropdownText}
                data={data}
                save="value"
              />

              {selected === "Tuition fees" && (
                <Input
                  placeholder="Student ID"
                  value={accounts.student_id}
                  onChangeText={(val) => {
                    setAccounts({
                      ...accounts,
                      student_id: val,
                    });
                  }}
                  keyboardType="default"
                  focused={focused === "student_id"}
                  onFocus={() => setFocused("student_id")}
                  onBlur={() => setFocused(null)}
                />
              )}
            </View>
          )}

          {typeR !== "exchange" &&
            currency_to !== "UK" &&
            currency_to !== "EUR" &&
            typeR !== "crypto" && (
              <View style={styles.group}>
                <Input
                  placeholder="IBAN"
                  value={accounts.iban}
                  onChangeText={(val) => {
                    setAccounts({
                      ...accounts,
                      iban: val,
                    });
                  }}
                  keyboardType="default"
                  focused={focused === "iban"}
                  onFocus={() => setFocused("iban")}
                  onBlur={() => setFocused(null)}
                />
                <Input
                  placeholder="SWIFT/BIC"
                  value={accounts.swift_bic}
                  onChangeText={(val) => {
                    setAccounts({
                      ...accounts,
                      swift_bic: val,
                    });
                  }}
                  keyboardType="default"
                  focused={focused === "swift_bic"}
                  onFocus={() => setFocused("swift_bic")}
                  onBlur={() => setFocused(null)}
                />
                <Input
                  placeholder="Recipient Address"
                  value={accounts.address}
                  onChangeText={(val) => {
                    setAccounts({
                      ...accounts,
                      address: val,
                    });
                  }}
                  keyboardType="default"
                  focused={focused === "address"}
                  onFocus={() => setFocused("address")}
                  onBlur={() => setFocused(null)}
                />
              </View>
            )}
        </View>

        <View style={styles.cta}>
          <PrimaryBtn title={"Continue"} onpressed={() => setEnabled(true)} />
        </View>
      </ScrollView>

      <View style={styles.modalWrap}>
        {enabled ? (
          <LogOutModal
            visibility={enabled}
            isLogout={false}
            setVisibility={setEnabled}
            text={`Are you sure you want to proceed?`}
            onPressed={handleContinue}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const selectBox = {
  height: 54,
  borderRadius: 14,
  borderWidth: 1.5,
  borderColor: "#e5e7eb",
  paddingHorizontal: 16,
};
const selectDropdown = {
  borderRadius: 14,
  borderColor: "#e5e7eb",
  marginTop: 4,
};
const selectDropdownText = { fontSize: 14, color: "#111827" };

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

  form: { marginTop: 20, gap: 12 },
  group: { gap: 12 },

  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  inputFocused: { borderColor: PRIMARY_COLOR },

  cta: { marginTop: 28, alignItems: "center" },

  modalWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ReceiverScreen;
