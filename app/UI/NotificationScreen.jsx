import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import tw from "twrnc";
import CustomHeader from "../Components/common/CustomHeader";
import { StatusBar } from "expo-status-bar";
import Icon from "@expo/vector-icons/Ionicons";
import { Platform } from "react-native";
import axios from "axios";
import { BASE_URL } from "../config/api/Index";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../config/redux/slice";
import { useFocusEffect } from "@react-navigation/native";

const NotificationScreen = () => {
  const [transactions, setTransaction] = useState([]);
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
      .then((response) => {
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
    <SafeAreaView style={tw`flex-grow w-full h-full bg-gray-100 p-5 pt-10`}>
      <StatusBar style="dark" />
      <View style={tw` w-full h-full ${Platform.OS == "ios" && "pl-5 pr-5"}`}>
        <CustomHeader title={"Notifications"} />
        {transactions.length > 0 ? (
          <ScrollView
            style={tw`mt-2 w-full h-[90%]`}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
            }
          >
            {transactions &&
              transactions.map((transact, i) => (
                <View
                  style={tw`rounded-lg p-3 mt-3 w-full flex flex-row bg-white justify-between items-center`}
                  key={i}
                >
                  <View style={tw`flex-1 flex flex-row items-center`}>
                    <Icon
                      name="md-notifications-outline"
                      style={tw`rounded-full w- p-3 text-blue-800 bg-gray-100 items-center text-center`}
                    />
                    <View style={tw`pl-1 w-full`}>
                      <Text style={tw`text-blue-900 text-[12px] font-medium`}>
                        {transact?.title}
                      </Text>
                      <Text style={tw`text-gray-500 text-[11px]`}>
                        {transact?.contents}
                      </Text>
                    </View>
                  </View>

                  <View style={tw`flex-1 items-end`}>
                    {/* <Text style={tw`text-gray-800 text-[12px]`}>Date</Text> */}
                    <Text style={tw`text-blue-800 text-[11px]`}>
                      {new Date(transact?.created_at).toDateString()}
                    </Text>
                  </View>
                </View>
              ))}
          </ScrollView>
        ) : (
          <ScrollView
            style={tw`mt-2 w-full h-[90%]`}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
            }
          >
            {/* <CustomHeader title={"History"} /> */}
            <View style={tw`items-center justify-center mt-5`}>
              <Icon
                name="md-alert-circle-outline"
                size={50}
                color={"#6B6B6C"}
              />
              <Text style={tw`text-center mt-2 text-gray-600`}>
                Notification is empty
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
