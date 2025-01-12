import React, { useState } from "react";
import { View, Text, SafeAreaView, TextInput, ScrollView } from "react-native";
import tw from "twrnc";
import { SelectList } from "react-native-dropdown-select-list";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Marquee } from "@animatereactnative/marquee";
import { selectRates, selectUserProfile, setExchanger } from "@/hooks/redux/slice";
import { router } from "expo-router";
import CustomHeader from "@/components/common/CustomHeader";
import PrimaryBtn from "@/components/common/PrimaryBtn";
import LogOutModal from "@/components/common/Modals/LogOutModal";
import LoadingModal from "@/components/common/Modals/LoadingModal";

const ExchangeScreen = () => {
  const [selected, setSelected] = React.useState("");
  const [selectedC, setSelectedC] = React.useState("");
  const [selectedD, setSelectedD] = React.useState("");
  const [enabled, setEnabled] = useState(false);
  const userProfile = useSelector(selectUserProfile);
  const [loading, setLoading] = useState(false);
  const rates = useSelector(selectRates);
  // console.log(rates)
  const dispatch = useDispatch();
  const [exchange, setExchange] = useState({
    from: "₦",
    to: "£",
  });
  const [rate, setRate] = useState("");
  const handleSelectCountry = (val:any) => {
    setSelected(val);
    if (val == "🇳🇬 NGN") {
      setExchange({
        to: "",
        from: "₦",
      });
      setSelectedD("NGN");
    } else if (val == "🇪🇺 EUR") {
      setExchange({
        to: "",
        from: "€",
      });
      setSelectedD("EUR");
    } else {
      setExchange({
        to: "",
        from: "£",
      });
      setSelectedD("UK");
    }
  };

  const handleSelectTo = (val:any) => {
    setLoading(true);
    setSelected(val);
    console.log(val);
    let faced_amount = exchange.from;
    let amounted = faced_amount.substring(1);
    if (val == "🇳🇬 NGN") {
      if (val == "🇳🇬 NGN" && exchange.from[0] == "₦") {
        setRate("₦1 - ₦1");
        setExchange({
          ...exchange,
          to: "₦" + amounted,
        });
      } else if (exchange.from[0] == "€") {
        let rated = rates.find((rate:any) => rate.name === "Naira - Euro");
        setRate(`€1 - ₦${rated.amount}`);
        let newAmount = Number(amounted) * rated.amount;
        // alert();
        setExchange({
          ...exchange,
          to: "₦" + newAmount.toFixed(2),
        });
      } else {
        let rated = rates.find((rate:any) => rate.name === "Naira");
        setRate(`${selectedD == "UK" ? "£" : "₦"}1 - ₦${rated.amount}`);
        let newAmount = Number(amounted) * rated.amount;
        // alert(newAmount);
        setExchange({
          ...exchange,
          to: "₦" + newAmount.toFixed(2),
        });
      }
      setSelectedC("NGN");
    } else if (val == "🇬🇧 UK") {
      if (val == "🇬🇧 UK" && exchange.from[0] == "£") {
        setRate("£1 - £1");
        setExchange({
          ...exchange,
          to: "£" + amounted,
        });
      } else if (exchange.from[0] == "€") {
        setRate("€1 - £1");
        setExchange({
          ...exchange,
          to: "£" + amounted,
        });
      } else {
        let rated = rates.find((rate:any) => rate.name === "Pounds");
        setRate(`£1 - ₦${rated.amount}`);
        let newAmount = Number(amounted) / rated.amount;
        // alert();
        setExchange({
          ...exchange,
          to: "£" + newAmount.toFixed(2),
        });
        setSelectedC("UK");
      }
    } else if (val == "🇪🇺 EUR") {
      if (val == "🇪🇺 EUR" && exchange.from[0] == "€") {
        setRate("€1 - €1");
        setExchange({
          ...exchange,
          to: "€" + amounted,
        });
      } else if (exchange.from[0] == "£") {
        setRate("£1 - €1");
        setExchange({
          ...exchange,
          to: "€" + amounted,
        });
      } else if (exchange.from[0] == "₦") {
        let rated = rates.find((rate:any) => rate.name === "Euro");
        setRate(`€1 - ₦${rated.amount}`);
        let newAmount = Number(amounted) / rated.amount;
        // alert();
        setExchange({
          ...exchange,
          to: "€" + newAmount.toFixed(2),
        });
      } else {
        let rated = rates.find((rate:any) => rate.name === "Naira - Euro");
        setRate(`€1 - ₦${rated.amount}`);
        let newAmount = Number(amounted) / rated.amount;
        // alert();
        setExchange({
          ...exchange,
          to: "€" + newAmount.toFixed(2),
        });
      }
      setSelectedC("EUR");
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const data = [
    { key: "2", value: "🇳🇬 NGN" },
    { key: "3", value: "🇬🇧 UK" },
    { key: "4", value: "🇪🇺 EUR" },
  ];
  const datas = [
    { key: "2", value: "🇳🇬 NGN" },
    { key: "5", value: "🇬🇧 UK" },
    { key: "6", value: "🇪🇺 EUR" },
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
        router.push({
          pathname: "/ReceiverScreen",
          params: {
            request_type: "exchange",
            currency_to: selectedC,
            currency_from: selectedD,
          }
        });
      } else {
        alert("All fields are required.");
      }
    } else {
      alert("Kindly verify your ID to continue exchange.");
    }
  };
  return (
    <SafeAreaView style={tw`flex-grow bg-white w-full h-full`}>
      <StatusBar style="dark" />
      <ScrollView
        style={tw`h-full w-full ${
          Platform.OS === "ios" ? "p-5 h-full w-full" : "p-5 h-full w-full"
        }`}
      >
        <CustomHeader title={"Exchange"} />

        {/* Currency From section */}
        <View
          style={tw`border border-gray-300 rounded-2xl p-5 w-full flex flex-row mt-10 items-center justify-between`}
        >
          <View style={tw`flex-1`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Currency from:</Text>
            <SelectList
              setSelected={(val:any) => {
                handleSelectCountry(val);
              }}
              placeholder="select"
              boxStyles={{
                width: 100,
                marginTop: 8,
                height: 45,
                padding: 2,
              }}
              data={data}
              save="value"
            />
          </View>
          <View style={tw`flex-1 pl-5 flex-col`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Amount:</Text>

            <TextInput
              value={exchange.from}
              placeholder="0.00"
              onChangeText={(val:any) => {
                setExchange({
                  ...exchange,
                  from: val,
                });
              }}
              style={tw`mt-4 text-[13px] `}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View
          style={tw`mt-4 flex flex-row w-full justify-between items-center`}
        >
          <Text
            style={tw`flex-1 border-r p-3 border-gray-400 text-[10px] text-gray-600`}
          >
            Rate : {rate}
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
          style={tw`border border-gray-300 rounded-2xl p-5 w-full flex flex-row mt-5 items-center justify-between`}
        >
          <View style={tw`flex-1`}>
            <Text style={tw`text-gray-800 text-[12px]`}>You get:</Text>
            <SelectList
              setSelected={(val:any) => {
                handleSelectTo(val);
              }}
              placeholder="select"
              boxStyles={{
                width: 100,
                marginTop: 8,
                height: 45,
                padding: 2,
              }}
              data={datas}
              save="value"
            />
          </View>
          <View style={tw`flex-1 pl-5 flex-col`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Amount:</Text>

            <TextInput
              value={exchange.to}
              placeholder="0.00"
              onChangeText={(val:any) => {
                setExchange({
                  ...exchange,
                  to: val,
                });
              }}
              style={tw`mt-4 text-[13px] text-gray-500`}
              editable={false}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* <Text style={tw`text-gray-600 text-sm mt-5`}>10% Service Charge applies</Text> */}

        <View style={tw`mt-12`}>
          <PrimaryBtn title={"Continue"} onpressed={() => setEnabled(true)} />
        </View>
        <View style={tw`mt-5`}>
          <Marquee spacing={20} speed={0.3}>
            <Text style={tw`text-[12px] text-gray-800`}>
              Kindly update your Identity to be able to exchange your currency;
              Instructions{" "}
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
            text={`Are you sure you want to proceed to exchange ${exchange.from} to ${exchange.to}?`}
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

export default ExchangeScreen;
