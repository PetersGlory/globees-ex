import React, { useState } from "react";
import { View, Text, SafeAreaView, TextInput, ScrollView } from "react-native";
import tw from "twrnc";
import { SelectList } from "react-native-dropdown-select-list";
import CustomHeader from "../Components/common/CustomHeader";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import PrimaryBtn from "../Components/common/PrimaryBtn";
import LogOutModal from "../Components/common/Modals/LogOutModal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRates,
  selectUserProfile,
  setExchanger,
} from "../config/redux/slice";
import LoadingModal from "../Components/common/Modals/LoadingModal";
import { NumberFormatter, primePercent } from "../config/api/Index";
import axios from "axios";
import { Marquee } from "@animatereactnative/marquee";

const CryptoScreen = ({ navigation }) => {
  const [selected, setSelected] = React.useState("");
  const [selectedC, setSelectedC] = React.useState("USD");
  const [selectedD, setSelectedD] = React.useState("");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const userProfile = useSelector(selectUserProfile);
  const dispatch = useDispatch();
  const rates = useSelector(selectRates);
  const [exchange, setExchange] = useState({
    from: "",
    to: "",
  });
  const [rate, setRate] = useState("");
  const [rated, setRated] = useState("");

  // let rated = rates.find(rate => rate.name === "Usd")

  // let rateds = rates.find(rate => rate.name === "USD - Crypto")

  const handleSelectCountry = async (val) => {
    setSelected(val);

    setLoading(true);
    setSelectedD(val);

    if (val == "BTC") {
      await btcHandler(exchange.from);
    } else if (val == "ETH") {
      await ethHandler(exchange.from);
    } else {
      setExchange({
        ...exchange,
        to: exchange.from,
      });
      let rateds = rates.find((rate) => rate.name === "USDT - Crypto");
      // setRate(`${exchange.from} - ₦${NumberFormatter(eval((Number(exchange?.from) * (rateds.amount))))}`)
      setRate(
        `₦${NumberFormatter(eval(Number(exchange?.from) * rateds.amount))}`
      );
      setRated(`1 - ₦${rateds.amount}`);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSelectTo = (val) => {
    setSelected(val);
    let faced_amount =
      exchange.to.length >= 1 ? exchange.to.substring(1) : exchange.to;

    if (val !== "") {
      setSelectedC("USD");
    }

    setExchange({
      ...exchange,
      to: "",
    });
  };

  const data = [{ key: "3", value: "🇺🇸 USA" }];
  const datas = [
    { key: "3", value: "BTC" },
    { key: "4", value: "USDT" },
    { key: "5", value: "ETH" },
  ];
  const handleExchange = () => {
    setEnabled(false);
    if (userProfile?.verified_user == "yes") {
      if (
        exchange.from !== "" ||
        (exchange.from.length > 0 && exchange.to !== "") ||
        exchange.to.length > 0
      ) {
        dispatch(setExchanger(exchange));
        navigation.push("ReceiverScreen", {
          request_type: "crypto",
          currency_from: selectedD,
          currency_to: selectedC,
        });
      } else {
        alert("All fields are required.");
      }
    } else {
      alert("Kindly verify your ID to continue exchange.");
    }
  };

  const btcHandler = async (value) => {
    console.log(value);
    let rateds = rates.find((rate) => rate.name === "BTC - Crypto");
    axios
      .request({
        method: "GET",
        url: `https://blockchain.info/tobtc?currency=USD&value=${value}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setExchange({
          ...exchange,
          to: JSON.stringify(response.data),
        });
        setRate(
          `₦${NumberFormatter(eval(Number(exchange?.from) * rateds.amount))}`
        );
        // setRate(`${JSON.stringify(response.data)} - ₦${NumberFormatter(eval((Number(exchange?.from) * (rateds.amount))))}`);
        setRated(`1 - ₦${rateds.amount}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const ethHandler = async (value) => {
    let rateds = rates.find((rate) => rate.name === "ETH - Crypto");
    axios
      .request({
        method: "GET",
        url: `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const ethPrice = response.data.ETH;
        const totalValue = eval(ethPrice * value);

        // console.log(totalValue)
        setExchange({
          ...exchange,
          to: JSON.stringify(totalValue),
        });
        // setRate(`${totalValue} - ₦${NumberFormatter(eval((Number(exchange?.from) * (rateds.amount))))}`);
        setRate(
          `₦${NumberFormatter(eval(Number(exchange?.from) * rateds.amount))}`
        );
        setRated(`1 - ₦${rateds.amount}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <SafeAreaView style={tw`flex-grow w-full h-full`}>
      <StatusBar style="dark" />
      <ScrollView
        style={tw`h-full w-full ${
          Platform.OS === "ios" ? "p-5 h-full w-full" : "p-5 h-full w-full"
        }`}
      >
        <CustomHeader title={"Crypto Exchange"} />

        {/* Currency From section */}
        <View
          style={tw`border border-gray-300 rounded-2xl px-5 py-2 w-full flex flex-row mt-5 items-center justify-between`}
        >
          <View style={tw`flex-1 flex-col`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Amount in USD:</Text>
            <TextInput
              value={exchange.from}
              placeholder="0.00"
              onChangeText={(val) => {
                setExchange({
                  ...exchange,
                  from: val,
                });
              }}
              style={tw`mt-1 mb-2 text-[13px] `}
              keyboardType="number-pad"
            />
            <Text style={tw`flex-1 text-[11px] text-gray-500`}>
              {exchange.to} ~ {selected}
            </Text>
          </View>
          <View style={tw`flex-1 flex-col text-right`}>
            <Text style={tw`text-gray-800 text-right text-[12px]`}>
              Digital Currency:
            </Text>
            <SelectList
              setSelected={(val) => {
                handleSelectCountry(val);
              }}
              placeholder="select"
              boxStyles={{
                ...tw`w-[100%]`,
                // width:100,
                marginTop: 8,
                height: 45,
                padding: 2,
              }}
              data={datas}
              save="value"
            />
          </View>
        </View>

        <View
          style={tw`mt-4 flex flex-row w-full justify-between items-center`}
        >
          <Text
            style={tw`flex-1 border-r p-3 border-gray-400 text-[10px] font-semibold text-gray-600`}
          >
            Rate : ${rated}
          </Text>
          <Text style={tw`flex-1 text-center text-[12px]`}>- To -</Text>
          <Text
            style={tw`flex-1 border-l p-3 border-gray-400 text-[10px] text-gray-600`}
          >
            Within minutes
          </Text>
        </View>

        {/* Currency To section */}
        <View
          style={tw`border border-gray-300 rounded-2xl px-5 py-2 w-full flex flex-row mt-5 items-center justify-between`}
        >
          <View style={tw`flex-1 items-start flex-col`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Payout Amount:</Text>

            <TextInput
              value={rate}
              placeholder="0.00"
              style={tw`mt-2 text-xl text-gray-600 font-semibold`}
              editable={false}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* <Text style={tw`text-gray-600 text-sm mt-2`}>8% Service Charge applies</Text> */}

        <View style={tw`mt-10`}>
          <PrimaryBtn title={"Continue"} onpressed={() => setEnabled(true)} />
        </View>

        <View style={tw`mt-5`}>
          <Marquee spacing={20} speed={0.3}>
            <Text style={tw`text-[12px] text-gray-800`}>
              Kindly update your Identity to be able to exchange your crypto to
              cash; Instructions{" "}
              <Text style={tw`font-bold`}>
                {"Home->More->Identity Verification"}
              </Text>
            </Text>
          </Marquee>
        </View>
      </ScrollView>
      <View style={tw`w-full items-center justify-center flex flex-col`}>
        {enabled ? (
          <LogOutModal
            visibility={enabled}
            setVisibility={setEnabled}
            text={`Are you sure you want to proceed to exchange ${exchange.to} ${selectedD}?`}
            onPressed={handleExchange}
          />
        ) : null}
        <LoadingModal
          visibility={loading}
          setVisibility={() => setLoading(false)}
          message={"Please wait..."}
          isloading={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default CryptoScreen;
