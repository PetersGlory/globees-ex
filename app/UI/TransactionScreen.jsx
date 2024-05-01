import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import tw from "twrnc";
import CustomHeader from "../Components/common/CustomHeader";
import { StatusBar } from "expo-status-bar";
import Icon from "@expo/vector-icons/Ionicons";
import TransactionModal from "../Components/common/Modals/TransactionModal";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api/Index";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../config/redux/slice";
import { useFocusEffect } from "@react-navigation/native";

const TransactionScreen = () => {
  const [modal, setModal] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const key = useSelector(selectAccessToken);
  const [transactions, setTransaction] = useState([]);

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
        url: `${BASE_URL}/transactions`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
      })
      .then((response) => {
        // let dataUser = response.data.data;
        // console.log(response.data)
        if (response.data.error == false) {
          setTransaction(response.data.message);
          setRefresh(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const [modalData, setModalData] = useState();
  const handleClose = () => {
    setModal(false);
  };
  const handleRefresh = () => {
    setRefresh(true);
    axios
      .request({
        method: "GET",
        url: `${BASE_URL}/transactions`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
      })
      .then((response) => {
        // let dataUser = response.data.data;
        // console.log(response.data)
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
    <SafeAreaView
      style={tw`flex-grow w-full h-full bg-gray-100 p-5 pt-10 ${
        Platform.OS == "ios" && "pl-5 pr-5"
      }`}
    >
      <StatusBar style="dark" />
      <View style={tw` w-full h-full ${Platform.OS == "ios" && "pl-5 pr-5"}`}>
        <CustomHeader title={"History"} />
        {transactions.length > 0 ? (
          <ScrollView
            style={tw`mt-2 w-full h-[90%]`}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
            }
          >
            {transactions &&
              transactions.map((transact, i) => (
                <TouchableOpacity
                  style={tw`rounded-lg p-3 mt-3 w-full flex flex-row bg-white justify-between items-center`}
                  key={i}
                  onPress={() => {
                    setModalData(transact);
                    setModal(true);
                  }}
                >
                  <View style={tw`flex-1 flex flex-row items-center`}>
                    <Icon
                      name="send-outline"
                      style={tw`rounded-full w- p-3 text-${
                        transact?.status == "successful" ||
                        transact?.status == "completed"
                          ? "blue"
                          : "red"
                      }-800 bg-gray-100 items-center text-center`}
                    />
                    <View style={tw`pl-3`}>
                      <Text style={tw`text-gray-800 text-[13px]`}>
                        To Globees Ex
                      </Text>
                      <Text
                        style={tw`text-${
                          transact?.status == "successful" ||
                          transact?.status == "completed"
                            ? "blue"
                            : "red"
                        }-400 text-[10px] p-1`}
                      >
                        {transact?.status}
                      </Text>
                    </View>
                  </View>

                  <View style={tw`flex-1 items-end`}>
                    <Text style={tw`text-gray-800 text-[12px]`}>Amount</Text>
                    <Text
                      style={tw`text-${
                        transact?.status == "successful" ||
                        transact?.status == "completed"
                          ? "blue"
                          : "red"
                      }-800 text-[15px]`}
                    >
                      {transact?.amountsend}
                    </Text>
                  </View>
                </TouchableOpacity>
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
                name="alert-circle-outline"
                size={50}
                color={"#6B6B6C"}
              />
              <Text style={tw`text-center mt-2 text-gray-600`}>
                Transaction History is empty
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
      {modal ? (
        <TransactionModal
          onpressed={handleClose}
          visibility={modal}
          data={modalData}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default TransactionScreen;
