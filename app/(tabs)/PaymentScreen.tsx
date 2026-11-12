import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import {
  selectRates,
  selectUserProfile,
  setExchanger,
} from "@/hooks/redux/slice";
import CustomHeader from "@/components/common/CustomHeader";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import LogOutModal from "@/components/common/Modals/LogOutModal";
import CustomLegal from "@/components/common/Modals/CustomLegal";
import { AmountFormatter } from "@/hooks/lib/formatter";

/* -------------------------------------------------------------------------- */
/*  Theme (same tokens as ExchangeScreen)                                     */
/* -------------------------------------------------------------------------- */

const COLORS = {
  brand: "#0E7C66", // change this to your brand colour
  brandSoft: "#E6F4F1",
  brandLine: "#CBE8E1",
  link: "#2563EB",
  ink: "#0F172A",
  body: "#475569",
  muted: "#94A3B8",
  line: "#E2E8F0",
  surface: "#F8FAFC",
  white: "#FFFFFF",
  warnBg: "#FFF7E6",
  warnLine: "#F5D99A",
  warnText: "#7A4E00",
};

/* -------------------------------------------------------------------------- */
/*  Currency config                                                           */
/* -------------------------------------------------------------------------- */

// Codes are kept exactly as before so ReceiverScreen's `currency_to` param and
// the Redux payload (`selectedC`, `selectedD`) don't change.
type PayoutCode = "USA" | "CAD" | "UK" | "EUR";

type Payout = {
  code: PayoutCode;
  short: string;
  name: string;
  symbol: string;
  flag: string;
  /** name of the entry in `rates` that gives NGN per 1 unit of this currency */
  rateName: string;
};

const PAYOUT_CURRENCIES: Payout[] = [
  {
    code: "USA",
    short: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    rateName: "USD",
  },
  {
    code: "CAD",
    short: "CAD",
    name: "Canadian Dollar",
    symbol: "$",
    flag: "🇨🇦",
    rateName: "CAD",
  },
  {
    code: "UK",
    short: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    rateName: "Pounds",
  },
  {
    code: "EUR",
    short: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    rateName: "Euro",
  },
];

const getPayout = (code: PayoutCode) =>
  PAYOUT_CURRENCIES.find((c) => c.code === code) as Payout;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const lookupRate = (rates: any[] | undefined, name: string): number => {
  const found = rates?.find((r: any) => r.name === name);
  return Number(found?.amount) || 0;
};

const formatMoney = (value: number) => {
  const [whole, decimals] = value.toFixed(2).split(".");
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decimals}`;
};

const sanitizeAmount = (raw: string) => {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  return rest.length ? `${whole}.${rest.join("").slice(0, 2)}` : whole;
};

/* -------------------------------------------------------------------------- */
/*  Currency picker (bottom sheet)                                            */
/* -------------------------------------------------------------------------- */

type SheetProps = {
  visible: boolean;
  selected: PayoutCode;
  onSelect: (code: PayoutCode) => void;
  onClose: () => void;
};

const CurrencySheet = ({
  visible,
  selected,
  onSelect,
  onClose,
}: SheetProps) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <Pressable style={styles.backdrop} onPress={onClose} />
    <SafeAreaView edges={["bottom"]} style={styles.sheet}>
      <View style={styles.sheetHandle} />
      <Text style={styles.sheetTitle}>Payout currency</Text>
      <FlatList
        data={PAYOUT_CURRENCIES}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          const active = item.code === selected;
          return (
            <Pressable
              onPress={() => onSelect(item.code)}
              style={({ pressed }) => [
                styles.sheetRow,
                active && styles.sheetRowActive,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.sheetFlag}>{item.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetCode}>{item.short}</Text>
                <Text style={styles.sheetName}>{item.name}</Text>
              </View>
              {active ? <Text style={styles.sheetCheck}>✓</Text> : null}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  </Modal>
);

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const rates = useSelector(selectRates);
  const userProfile = useSelector(selectUserProfile);

  const [payoutCode, setPayoutCode] = useState<PayoutCode>("USA");
  const [amount, setAmount] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [legalVisible, setLegalVisible] = useState(false);

  const payout = getPayout(payoutCode);
  const isVerified = userProfile?.verified_user === "yes";
  const numericAmount = Number(amount) || 0;

  // NGN per 1 unit of the payout currency
  const ngnRate = useMemo(
    () => lookupRate(rates, payout.rateName),
    [rates, payout.rateName],
  );

  // What the user pays in naira, updated live as they type
  const ngnToPay = useMemo(
    () => (numericAmount > 0 && ngnRate > 0 ? numericAmount * ngnRate : null),
    [numericAmount, ngnRate],
  );

  const rateLabel =
    ngnRate > 0
      ? `1 ${payout.short} = ₦${formatMoney(ngnRate)}`
      : "Rate unavailable";

  const canContinue = ngnToPay !== null;

  /* ---- actions ---------------------------------------------------------- */

  const handleContinue = () => {
    if (!isVerified) {
      Alert.alert(
        "Verification required",
        "Please verify your identity to continue with this payment.",
      );
      return;
    }
    if (ngnToPay === null) {
      Alert.alert(
        "Enter an amount",
        "Enter the amount you want the receiver to get.",
      );
      return;
    }
    setConfirmVisible(true);
  };

  const handleConfirm = () => {
    setConfirmVisible(false);
    if (ngnToPay === null) return;

    // Same payload shape as before: symbol-prefixed strings plus the codes.
    dispatch(
      setExchanger({
        from: `₦${ngnToPay.toFixed(2)}`,
        to: `${payout.symbol}${amount}`,
        selectedC: payoutCode,
        selectedD: "NGN",
      }),
    );

    router.push({
      pathname: "/ReceiverScreen",
      params: {
        request_type: "payment",
        currency_from: "NGN",
        currency_to: payoutCode,
      },
    });
  };

  /* ---- render ----------------------------------------------------------- */

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CustomHeader title="Send Money" />

          <Text style={styles.heading}>Pay out to a bank account</Text>
          <Text style={styles.subtitle}>
            Enter what the receiver should get. We'll show what you pay in
            naira.
          </Text>

          {/* Receiver gets */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Receiver gets</Text>
            <View style={styles.fieldRow}>
              <Pressable
                style={styles.currencyPill}
                onPress={() => setPickerVisible(true)}
                accessibilityRole="button"
                accessibilityLabel={`Payout currency, ${payout.short}. Tap to change`}
              >
                <Text style={styles.pillFlag}>{payout.flag}</Text>
                <Text style={styles.pillCode}>{payout.short}</Text>
                <Text style={styles.pillChevron}>⌄</Text>
              </Pressable>

              <View style={styles.amountWrap}>
                <Text style={styles.amountSymbol}>{payout.symbol}</Text>
                <TextInput
                  value={amount}
                  onChangeText={(v) => setAmount(sanitizeAmount(v))}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="decimal-pad"
                  style={styles.amountInput}
                  maxLength={12}
                />
              </View>
            </View>
            <Text style={styles.hint}>
              This amount will be sent to the receiver's account.
            </Text>
          </View>

          {/* Rate */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Rate</Text>
              <Text style={styles.summaryValue}>{rateLabel}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Delivery</Text>
              <Text style={styles.summaryValue}>Within minutes</Text>
            </View>
          </View>

          {/* You pay */}
          <View style={[styles.card, styles.cardPay]}>
            <Text style={styles.cardLabel}>You pay</Text>
            <View style={styles.fieldRow}>
              <View style={[styles.currencyPill, styles.pillStatic]}>
                <Text style={styles.pillFlag}>🇳🇬</Text>
                <Text style={styles.pillCode}>NGN</Text>
              </View>

              <View style={styles.amountWrap}>
                <Text
                  style={[styles.amountSymbol, ngnToPay === null && styles.dim]}
                >
                  ₦
                </Text>
                <Text
                  style={[styles.payAmount, ngnToPay === null && styles.dim]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {ngnToPay !== null ? formatMoney(ngnToPay) : "0.00"}
                </Text>
              </View>
            </View>
            <Text style={styles.hint}>
              Send this amount from your Naira bank account to Globees Ex.
            </Text>
          </View>

          {/* Legal */}
          <View style={styles.legalRow}>
            <Text style={styles.legalText}>
              Service charge applies. See our{" "}
            </Text>
            <Pressable onPress={() => setLegalVisible(true)} hitSlop={8}>
              <Text style={styles.legalLink}>Payment Gateway T&Cs</Text>
            </Pressable>
          </View>

          {/* Verification notice, only when it matters */}
          {!isVerified ? (
            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>
                Verify your identity to send money
              </Text>
              <Text style={styles.noticeText}>
                Go to Home, select More, then choose Complete Identity
                Verification.
              </Text>
            </View>
          ) : null}

          <View style={styles.cta}>
            <PrimaryBtn
              title="Continue"
              onpressed={handleContinue}
              {...({ disabled: !canContinue } as any)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CurrencySheet
        visible={pickerVisible}
        selected={payoutCode}
        onSelect={(code) => {
          setPayoutCode(code);
          setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
      />

      {confirmVisible ? (
        <LogOutModal
          visibility={confirmVisible}
          setVisibility={setConfirmVisible}
          isLogout={false}
          text={`Send ${payout.symbol}${AmountFormatter(amount)}? You'll pay ₦${
            ngnToPay !== null ? formatMoney(ngnToPay) : ""
          }.`}
          onPressed={handleConfirm}
        />
      ) : null}

      <CustomLegal visibility={legalVisible} setVisibility={setLegalVisible} />
    </SafeAreaView>
  );
};

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  heading: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.ink,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.body,
  },

  /* cards */
  card: {
    marginTop: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 20,
    padding: 16,
  },
  cardPay: {
    marginTop: 0,
    backgroundColor: COLORS.brandSoft,
    borderColor: COLORS.brandLine,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.body,
    marginBottom: 14,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hint: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.body,
  },

  /* currency pill */
  currencyPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  pillStatic: { paddingRight: 14 },
  pillFlag: { fontSize: 20 },
  pillCode: { fontSize: 15, fontWeight: "700", color: COLORS.ink },
  pillChevron: { fontSize: 16, color: COLORS.body, marginTop: -4 },

  /* amounts */
  amountWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: 12,
  },
  amountSymbol: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.ink,
    marginRight: 4,
  },
  amountInput: {
    flexShrink: 1,
    minWidth: 80,
    textAlign: "right",
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.ink,
    paddingVertical: 0,
  },
  payAmount: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.brand,
  },
  dim: { color: COLORS.muted },

  /* rate summary */
  summary: {
    marginVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  summaryDivider: { height: 1, backgroundColor: COLORS.line },
  summaryKey: { fontSize: 14, color: COLORS.body },
  summaryValue: { fontSize: 14, fontWeight: "700", color: COLORS.ink },

  /* legal */
  legalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 18,
  },
  legalText: { fontSize: 12, color: COLORS.body },
  legalLink: { fontSize: 12, fontWeight: "700", color: COLORS.link },

  /* notice */
  notice: {
    marginTop: 16,
    backgroundColor: COLORS.warnBg,
    borderColor: COLORS.warnLine,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  noticeTitle: { fontSize: 14, fontWeight: "700", color: COLORS.warnText },
  noticeText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.warnText,
  },

  cta: { marginTop: 24 },

  /* bottom sheet */
  backdrop: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.45)" },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.line,
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.ink,
    marginBottom: 8,
  },
  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  sheetRowActive: { backgroundColor: COLORS.brandSoft },
  sheetFlag: { fontSize: 28 },
  sheetCode: { fontSize: 16, fontWeight: "700", color: COLORS.ink },
  sheetName: { fontSize: 13, color: COLORS.body, marginTop: 2 },
  sheetCheck: { fontSize: 20, fontWeight: "800", color: COLORS.brand },
});

export default PaymentScreen;
