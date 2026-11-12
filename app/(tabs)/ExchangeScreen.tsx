import React, { useCallback, useMemo, useState } from "react";
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
import { AmountFormatter } from "@/hooks/lib/formatter";

/* -------------------------------------------------------------------------- */
/*  Theme                                                                     */
/* -------------------------------------------------------------------------- */

const COLORS = {
  brand: "#0E7C66", // change this to your brand colour
  brandSoft: "#E6F4F1",
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

// NOTE: the codes ("NGN" | "UK" | "EUR") are kept exactly as before so the
// `currency_from` / `currency_to` params your ReceiverScreen reads don't change.
type CurrencyCode = "NGN" | "UK" | "EUR";

type Currency = {
  code: CurrencyCode;
  short: string;
  name: string;
  symbol: string;
  flag: string;
  /** name of the entry in `rates` that gives NGN per 1 unit when SELLING this currency */
  sellRateName: string | null;
  /** name of the entry in `rates` that gives NGN per 1 unit when BUYING this currency */
  buyRateName: string | null;
};

const CURRENCIES: Currency[] = [
  {
    code: "NGN",
    short: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    flag: "🇳🇬",
    sellRateName: null,
    buyRateName: null,
  },
  {
    code: "UK",
    short: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    sellRateName: "Naira",
    buyRateName: "Pounds",
  },
  {
    code: "EUR",
    short: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    sellRateName: "Naira - Euro",
    buyRateName: "Euro",
  },
];

const getCurrency = (code: CurrencyCode) =>
  CURRENCIES.find((c) => c.code === code) as Currency;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const lookupRate = (rates: any[] | undefined, name: string | null): number => {
  if (name === null) return 1; // NGN
  const found = rates?.find((r: any) => r.name === name);
  return Number(found?.amount) || 0;
};

/** Converts via NGN so every pair (including GBP <-> EUR) uses real rates. */
const convert = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: any[] | undefined,
): number | null => {
  if (from === to) return amount;
  const sell = lookupRate(rates, getCurrency(from).sellRateName);
  const buy = lookupRate(rates, getCurrency(to).buyRateName);
  if (!sell || !buy) return null;
  return (amount * sell) / buy;
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

type PickerProps = {
  visible: boolean;
  title: string;
  selected: CurrencyCode;
  onSelect: (code: CurrencyCode) => void;
  onClose: () => void;
};

const CurrencySheet = ({
  visible,
  title,
  selected,
  onSelect,
  onClose,
}: PickerProps) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <Pressable style={styles.backdrop} onPress={onClose} />
    <SafeAreaView edges={["bottom"]} style={styles.sheet}>
      <View style={styles.sheetHandle} />
      <Text style={styles.sheetTitle}>{title}</Text>
      <FlatList
        data={CURRENCIES}
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

const ExchangeScreen = () => {
  const dispatch = useDispatch();
  const rates = useSelector(selectRates);
  const userProfile = useSelector(selectUserProfile);

  const [fromCode, setFromCode] = useState<CurrencyCode>("NGN");
  const [toCode, setToCode] = useState<CurrencyCode>("UK");
  const [amount, setAmount] = useState("");
  const [picker, setPicker] = useState<"from" | "to" | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const from = getCurrency(fromCode);
  const to = getCurrency(toCode);
  const isVerified = userProfile?.verified_user === "yes";

  const numericAmount = Number(amount) || 0;

  const converted = useMemo(
    () =>
      numericAmount > 0
        ? convert(numericAmount, fromCode, toCode, rates)
        : null,
    [numericAmount, fromCode, toCode, rates],
  );

  const unitRate = useMemo(
    () => convert(1, fromCode, toCode, rates),
    [fromCode, toCode, rates],
  );

  const rateLabel =
    unitRate !== null
      ? `1 ${from.short} = ${to.symbol}${formatMoney(unitRate)}`
      : "Rate unavailable";

  /* ---- actions ---------------------------------------------------------- */

  const handleSwap = useCallback(() => {
    setFromCode(toCode);
    setToCode(fromCode);
  }, [fromCode, toCode]);

  const handlePick = (side: "from" | "to", code: CurrencyCode) => {
    // picking the currency that's already on the other side simply swaps them
    if (side === "from") {
      if (code === toCode) setToCode(fromCode);
      setFromCode(code);
    } else {
      if (code === fromCode) setFromCode(toCode);
      setToCode(code);
    }
    setPicker(null);
  };

  const handleContinue = () => {
    if (!isVerified) {
      Alert.alert(
        "Verification required",
        "Please verify your identity to continue with this exchange.",
      );
      return;
    }
    if (fromCode === toCode) {
      Alert.alert(
        "Choose different currencies",
        "Pick two different currencies to exchange.",
      );
      return;
    }
    if (numericAmount <= 0 || converted === null) {
      Alert.alert("Enter an amount", "Enter the amount you want to exchange.");
      return;
    }
    setConfirmVisible(true);
  };

  const handleConfirm = () => {
    setConfirmVisible(false);
    if (converted === null) return;

    // Same shape as before: strings that include the currency symbol.
    dispatch(
      setExchanger({
        from: `${from.symbol}${amount}`,
        to: `${to.symbol}${converted.toFixed(2)}`,
      }),
    );

    router.push({
      pathname: "/ReceiverScreen",
      params: {
        request_type: "exchange",
        currency_to: toCode,
        currency_from: fromCode,
      },
    });
  };

  const canContinue =
    numericAmount > 0 && converted !== null && fromCode !== toCode;

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
          <CustomHeader title="Exchange" />

          <Text style={styles.heading}>Convert your money</Text>
          <Text style={styles.subtitle}>
            See exactly what you'll get before you confirm.
          </Text>

          {/* You send + You receive */}
          <View style={styles.pair}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>You send</Text>
              <View style={styles.fieldRow}>
                <Pressable
                  style={styles.currencyPill}
                  onPress={() => setPicker("from")}
                  accessibilityRole="button"
                  accessibilityLabel={`Sending currency, ${from.short}. Tap to change`}
                >
                  <Text style={styles.pillFlag}>{from.flag}</Text>
                  <Text style={styles.pillCode}>{from.short}</Text>
                  <Text style={styles.pillChevron}>⌄</Text>
                </Pressable>

                <View style={styles.amountWrap}>
                  <Text style={styles.amountSymbol}>{from.symbol}</Text>
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
            </View>

            <Pressable
              onPress={handleSwap}
              style={({ pressed }) => [
                styles.swapBtn,
                pressed && { opacity: 0.8 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Swap currencies"
              hitSlop={8}
            >
              <Text style={styles.swapIcon}>⇅</Text>
            </Pressable>

            <View style={[styles.card, styles.cardReceive]}>
              <Text style={styles.cardLabel}>You receive</Text>
              <View style={styles.fieldRow}>
                <Pressable
                  style={styles.currencyPill}
                  onPress={() => setPicker("to")}
                  accessibilityRole="button"
                  accessibilityLabel={`Receiving currency, ${to.short}. Tap to change`}
                >
                  <Text style={styles.pillFlag}>{to.flag}</Text>
                  <Text style={styles.pillCode}>{to.short}</Text>
                  <Text style={styles.pillChevron}>⌄</Text>
                </Pressable>

                <View style={styles.amountWrap}>
                  <Text
                    style={[
                      styles.amountSymbol,
                      converted === null && styles.dim,
                    ]}
                  >
                    {to.symbol}
                  </Text>
                  <Text
                    style={[
                      styles.receiveAmount,
                      converted === null && styles.dim,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {converted !== null ? formatMoney(converted) : "0.00"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Rate summary */}
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

          {/* Verification notice, only when it matters */}
          {!isVerified ? (
            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>
                Verify your identity to exchange
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
        visible={picker !== null}
        title={picker === "from" ? "You send" : "You receive"}
        selected={picker === "from" ? fromCode : toCode}
        onSelect={(code) => picker && handlePick(picker, code)}
        onClose={() => setPicker(null)}
      />

      {confirmVisible ? (
        <LogOutModal
          visibility={confirmVisible}
          isLogout={false}
          setVisibility={setConfirmVisible}
          text={`Exchange ${from.symbol}${AmountFormatter(amount)} to ${to.symbol}${
            converted !== null ? formatMoney(converted) : ""
          }?`}
          onPressed={handleConfirm}
        />
      ) : null}
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
  pair: { marginTop: 24 },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardReceive: {
    marginTop: 10,
    backgroundColor: COLORS.brandSoft,
    borderColor: "#CBE8E1",
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
  receiveAmount: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.brand,
  },
  dim: { color: COLORS.muted },

  /* swap button sits on the seam between the two cards */
  swapBtn: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    marginTop: -20,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brand,
    borderWidth: 4,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  swapIcon: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
    marginTop: -2,
  },

  /* summary */
  summary: {
    marginTop: 18,
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

  cta: { marginTop: 28 },

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

export default ExchangeScreen;
