import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import Icon from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useSelector } from "react-redux";
import { router, useFocusEffect } from "expo-router";
import { selectAccessToken } from "@/hooks/redux/slice";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api";
import CustomHeader from "@/components/common/CustomHeader";
import TransactionModal from "@/components/common/Modals/TransactionModal";
import { AmountFormatter } from "@/hooks/lib/formatter";

interface Transaction {
  id?: string | number;
  status?: string;
  amountsend?: string;
  category?: string;
  created_at?: string;
}

interface Group {
  title: string;
  items: Transaction[];
}

type StatusKind = "success" | "pending" | "failed";
type Filter = "all" | StatusKind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "success", label: "Successful" },
  { key: "pending", label: "Pending" },
  { key: "failed", label: "Failed" },
];

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
  if (value === "successful" || value === "completed" || value === "success")
    return "success";
  if (value === "pending" || value === "processing" || value === "initiated")
    return "pending";
  return "failed";
};

const capitalize = (value?: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";

const parseDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const getDayLabel = (value?: string) => {
  const date = parseDate(value);
  if (!date) return "Earlier";
  const diff = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86400000,
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getTime = (value?: string) => {
  const date = parseDate(value);
  return date
    ? date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : null;
};

const groupTransactions = (items: Transaction[]): Group[] => {
  const sorted = [...items].sort((a, b) => {
    const da = parseDate(a.created_at)?.getTime() ?? 0;
    const db = parseDate(b.created_at)?.getTime() ?? 0;
    return db - da;
  });

  const groups = new Map<string, Transaction[]>();
  sorted.forEach((item) => {
    const label = getDayLabel(item.created_at);
    groups.set(label, [...(groups.get(label) ?? []), item]);
  });

  return Array.from(groups, ([title, list]) => ({ title, items: list }));
};

const SkeletonList = () => (
  <View style={tw`px-5`}>
    {[3, 2].map((count, g) => (
      <View key={g} style={tw`mt-5`}>
        <View style={tw`h-3 w-16 rounded bg-gray-200 mb-3 ml-1`} />
        <View
          style={tw`bg-white rounded-2xl border border-gray-100 overflow-hidden`}
        >
          {Array.from({ length: count }).map((_, i) => (
            <View
              key={i}
              style={[
                tw`flex-row items-center px-4 py-3.5`,
                i > 0 && tw`border-t border-gray-100`,
              ]}
            >
              <View style={tw`w-10 h-10 rounded-full bg-gray-200 mr-3`} />
              <View style={tw`flex-1`}>
                <View style={tw`h-3.5 w-28 rounded bg-gray-200 mb-2`} />
                <View style={tw`h-3 w-20 rounded bg-gray-100`} />
              </View>
              <View style={tw`h-4 w-16 rounded bg-gray-200`} />
            </View>
          ))}
        </View>
      </View>
    ))}
  </View>
);

const TransactionScreen = () => {
  const token = useSelector(selectAccessToken);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Transaction | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/transactions`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.error) {
        setTransactions(response.data.message ?? []);
        setFailed(false);
      } else {
        setFailed(true);
      }
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const groups = useMemo(() => {
    const filtered =
      filter === "all"
        ? transactions
        : transactions.filter((t) => getStatusKind(t.status) === filter);
    return groupTransactions(filtered);
  }, [transactions, filter]);

  const renderEmpty = () => {
    if (failed && transactions.length === 0) {
      return (
        <View style={tw`items-center px-8 pt-16`}>
          <View
            style={tw`w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4`}
          >
            <Icon name="cloud-offline-outline" size={28} color="#B91C1C" />
          </View>
          <Text style={tw`text-gray-900 font-semibold text-base`}>
            Couldn't load transactions
          </Text>
          <Text style={tw`text-gray-500 text-sm text-center mt-1`}>
            Check your connection and try again.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              load();
            }}
            activeOpacity={0.85}
            style={tw`mt-5 px-5 py-2.5 rounded-full border border-gray-300`}
            accessibilityRole="button"
          >
            <Text style={tw`text-gray-800 font-semibold text-sm`}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    const filtering = filter !== "all";
    return (
      <View style={tw`items-center px-8 pt-16`}>
        <View
          style={tw`w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4`}
        >
          <Icon name="receipt-outline" size={28} color="#6B7280" />
        </View>
        <Text style={tw`text-gray-900 font-semibold text-base`}>
          {filtering ? "No matching transactions" : "No transactions yet"}
        </Text>
        <Text style={tw`text-gray-500 text-sm text-center mt-1`}>
          {filtering
            ? "Try a different filter."
            : "Your exchanges and payments will show up here."}
        </Text>
        {!filtering && (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/ExchangeScreen")}
            activeOpacity={0.85}
            style={[
              tw`mt-5 px-5 py-2.5 rounded-full`,
              { backgroundColor: PRIMARY_COLOR },
            ]}
            accessibilityRole="button"
          >
            <Text style={tw`text-white font-semibold text-sm`}>
              Start an exchange
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <StatusBar style="dark" />

      <View style={tw`px-5`}>
        <CustomHeader title={"History"} />

        <View style={tw`flex-row mt-4`}>
          {FILTERS.map((item, i) => {
            const active = item.key === filter;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setFilter(item.key)}
                activeOpacity={0.8}
                style={[
                  tw`px-4 py-2 rounded-full`,
                  i > 0 && tw`ml-2`,
                  active
                    ? { backgroundColor: PRIMARY_COLOR }
                    : {
                        backgroundColor: "#FFFFFF",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                      },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    tw`text-xs font-semibold`,
                    { color: active ? "#FFFFFF" : "#4B5563" },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {loading ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(group) => group.title}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingHorizontal: 20, paddingBottom: 32 },
            groups.length === 0 && { flexGrow: 1 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={PRIMARY_COLOR}
              colors={[PRIMARY_COLOR]}
            />
          }
          ListEmptyComponent={renderEmpty}
          renderItem={({ item: group }) => (
            <View style={tw`mt-5`}>
              <Text style={tw`text-gray-500 text-xs font-semibold mb-2 ml-1`}>
                {group.title}
              </Text>
              <View
                style={tw`bg-white rounded-2xl border border-gray-100 overflow-hidden`}
              >
                {group.items.map((item, i) => {
                  const style = STATUS_STYLES[getStatusKind(item.status)];
                  const time = getTime(item.created_at);
                  const detail = [capitalize(item.category), time]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <TouchableOpacity
                      key={item.id ?? `${group.title}-${i}`}
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

                      <View style={tw`flex-1 mr-3`}>
                        <Text style={tw`text-gray-900 text-sm font-medium`}>
                          To Globees Ex
                        </Text>
                        <Text
                          style={tw`text-gray-500 text-xs mt-0.5`}
                          numberOfLines={1}
                        >
                          {detail || " "}
                        </Text>
                      </View>

                      <View style={tw`items-end`}>
                        <Text style={tw`text-gray-900 font-semibold text-sm`}>
                          {AmountFormatter(item.amountsend as string)}
                        </Text>
                        <Text
                          style={[
                            tw`text-xs mt-0.5 font-medium`,
                            { color: style.color },
                          ]}
                        >
                          {capitalize(item.status)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        />
      )}

      {selected && (
        <TransactionModal
          onpressed={() => setSelected(null)}
          visibility={!!selected}
          data={selected}
        />
      )}
    </SafeAreaView>
  );
};

export default TransactionScreen;
