import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import Icon from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "@/hooks/redux/slice";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api";
import TransactionModal from "../common/Modals/TransactionModal";
import { AmountFormatter } from "@/hooks/lib/formatter";

interface Transaction {
  id?: string | number;
  status?: string;
  amountsend?: string;
}

interface TransactionsProps {
  /** Change this value to trigger a refetch (e.g. after pull-to-refresh). */
  refreshKey?: number;
  /** How many recent items to show on the home screen. */
  limit?: number;
}

type StatusKind = "success" | "pending" | "failed";

const STATUS_STYLES: Record<
  StatusKind,
  { color: string; bg: string; icon: React.ComponentProps<typeof Icon>["name"] }
> = {
  success: { color: "#047857", bg: "#ECFDF5", icon: "arrow-up" },
  pending: { color: "#B45309", bg: "#FFFBEB", icon: "time-outline" },
  failed: { color: "#B91C1C", bg: "#FEF2F2", icon: "close" },
};

const getStatusKind = (status?: string): StatusKind => {
  const value = (status ?? "").toLowerCase();
  if (value === "successful" || value === "completed") return "success";
  if (value === "pending" || value === "processing" || value === "initiated") return "pending";
  return "failed";
};

const capitalize = (value?: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                    */
/* -------------------------------------------------------------------------- */

const SkeletonRow = ({ divider }: { divider: boolean }) => (
  <View
    style={[tw`flex-row items-center px-4 py-3.5`, divider && tw`border-t border-gray-100`]}
  >
    <View style={tw`w-10 h-10 rounded-full bg-gray-200 mr-3`} />
    <View style={tw`flex-1`}>
      <View style={tw`h-3.5 w-28 rounded bg-gray-200 mb-2`} />
      <View style={tw`h-3 w-16 rounded bg-gray-100`} />
    </View>
    <View style={tw`h-4 w-16 rounded bg-gray-200`} />
  </View>
);

const EmptyState = () => (
  <View style={tw`items-center px-6 py-8`}>
    <View style={tw`w-14 h-14 rounded-full bg-gray-100 items-center justify-center mb-3`}>
      <Icon name="receipt-outline" size={26} color="#6B7280" />
    </View>
    <Text style={tw`text-gray-900 font-semibold text-base`}>No transactions yet</Text>
    <Text style={tw`text-gray-500 text-sm text-center mt-1`}>
      Your exchanges and payments will show up here.
    </Text>
    <TouchableOpacity
      onPress={() => router.push("/(tabs)/ExchangeScreen")}
      activeOpacity={0.85}
      style={[tw`mt-5 px-5 py-2.5 rounded-full`, { backgroundColor: PRIMARY_COLOR }]}
      accessibilityRole="button"
    >
      <Text style={tw`text-white font-semibold text-sm`}>Start an exchange</Text>
    </TouchableOpacity>
  </View>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <View style={tw`items-center px-6 py-8`}>
    <View style={tw`w-14 h-14 rounded-full bg-red-50 items-center justify-center mb-3`}>
      <Icon name="cloud-offline-outline" size={26} color="#B91C1C" />
    </View>
    <Text style={tw`text-gray-900 font-semibold text-base`}>Couldn't load transactions</Text>
    <Text style={tw`text-gray-500 text-sm text-center mt-1`}>
      Check your connection and try again.
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      activeOpacity={0.85}
      style={tw`mt-5 px-5 py-2.5 rounded-full border border-gray-300`}
      accessibilityRole="button"
    >
      <Text style={tw`text-gray-800 font-semibold text-sm`}>Try again</Text>
    </TouchableOpacity>
  </View>
);

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const Transactions = ({ refreshKey = 0, limit = 5 }: TransactionsProps) => {
  const token = useSelector(selectAccessToken);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<Transaction | null>(null);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);

    axios
      .get(`${BASE_URL}/transactions`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (cancelled) return;
        if (!response.data.error) {
          setTransactions(response.data.message ?? []);
        } else {
          setFailed(true);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, refreshKey, attempt]);

  const recent = transactions.slice(0, limit);

  return (
    <View style={tw`px-5`}>
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <Text style={tw`text-gray-900 font-semibold text-base`}>Recent activity</Text>
        {recent.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push("TransactionScreen" as never)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
          >
            <Text style={[tw`text-sm font-medium`, { color: PRIMARY_COLOR }]}>See all</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={tw`bg-white rounded-2xl border border-gray-100 overflow-hidden`}>
        {loading ? (
          [0, 1, 2].map((i) => <SkeletonRow key={i} divider={i > 0} />)
        ) : failed && transactions.length === 0 ? (
          <ErrorState onRetry={() => { setLoading(true); setAttempt((a) => a + 1); }} />
        ) : recent.length === 0 ? (
          <EmptyState />
        ) : (
          recent.map((item, i) => {
            const kind = getStatusKind(item.status);
            const style = STATUS_STYLES[kind];

            return (
              <TouchableOpacity
                key={item.id ?? i}
                activeOpacity={0.7}
                onPress={() => setSelected(item)}
                style={[
                  tw`flex-row items-center px-4 py-3.5`,
                  i > 0 && tw`border-t border-gray-100`,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Transfer to Globees Ex, ${item.amountsend}, ${item.status}`}
              >
                <View
                  style={[
                    tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
                    { backgroundColor: style.bg },
                  ]}
                >
                  <Icon name={style.icon} size={18} color={style.color} />
                </View>

                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-900 text-sm font-medium`}>To Globees Ex</Text>
                  <Text style={[tw`text-xs mt-0.5`, { color: style.color }]}>
                    {capitalize(item.status)}
                  </Text>
                </View>

                <Text style={tw`text-gray-900 font-semibold text-sm`}>{AmountFormatter(item.amountsend as string)}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {selected && (
        <TransactionModal
          onpressed={() => setSelected(null)}
          visibility={!!selected}
          data={selected}
        />
      )}
    </View>
  );
};

export default Transactions;