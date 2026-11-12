import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Icon from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFocusEffect } from "expo-router";
import { selectAccessToken } from "@/hooks/redux/slice";
import { BASE_URL, PRIMARY_COLOR } from "@/hooks/api";
import CustomHeader from "@/components/common/CustomHeader";

interface notficationProps {
  title: string;
  contents: string;
  created_at: string;
}
const NotificationScreen = () => {
  const [transactions, setTransaction] = useState<notficationProps[]>([]);
  const [refresh, setRefresh] = useState(true);
  const key = useSelector(selectAccessToken);
  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );
  useEffect(() => {
    // Getting Profile
    axios
      .request({
        method: "GET",
        url: `${BASE_URL}/notifications`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
      })
      .then((response) => {
        if (response.data.error == false) {
          setTransaction(response.data.message);
          setRefresh(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setRefresh(false);
      });
  }, []);

  const handleRefresh = () => {
    setRefresh(true);
    axios
      .request({
        method: "GET",
        url: `${BASE_URL}/notifications`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
      })
      .then((response: any) => {
        if (response.status !== 200 || response.status !== 201) {
          setRefresh(false);
        } else {
          if (response.data.error == false) {
            setTransaction(response.data.message);
            setRefresh(false);
          } else {
            setRefresh(false);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setRefresh(false);
      });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <CustomHeader title={"Notifications"} />

        {transactions.length > 0 ? (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={handleRefresh}
                tintColor={PRIMARY_COLOR}
              />
            }
          >
            {transactions.map((transact, i) => (
              <View style={styles.item} key={i}>
                <View style={styles.itemIcon}>
                  <Icon
                    name="notifications-outline"
                    size={18}
                    color={PRIMARY_COLOR}
                  />
                </View>

                <View style={styles.itemBody}>
                  <View style={styles.itemTop}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {transact?.title}
                    </Text>
                    <Text style={styles.itemDate} numberOfLines={1}>
                      {new Date(transact?.created_at).toDateString()}
                    </Text>
                  </View>
                  <Text style={styles.itemContent}>{transact?.contents}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.emptyContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={handleRefresh}
                tintColor={PRIMARY_COLOR}
              />
            }
          >
            <View style={styles.emptyIcon}>
              <Icon
                name="notifications-off-outline"
                size={32}
                color="#9ca3af"
              />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>
              Updates about your transactions and account will appear here.
            </Text>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, paddingHorizontal: 20 },

  list: { flex: 1, marginTop: 8 },
  listContent: { paddingBottom: 32 },

  item: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    backgroundColor: "#FFFFFF",
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  itemBody: { flex: 1, marginLeft: 12 },
  itemTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTitle: {
    flex: 1,
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "700",
  },
  itemDate: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 8,
  },
  itemContent: {
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  emptyContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },
  emptyTitle: { color: PRIMARY_COLOR, fontSize: 15, fontWeight: "700" },
  emptyText: {
    color: "#9ca3af",
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 40,
  },
});

export default NotificationScreen;
