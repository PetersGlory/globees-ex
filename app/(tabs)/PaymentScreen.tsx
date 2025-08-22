import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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
import CustomLegal from "@/components/common/Modals/CustomLegal";

const PaymentScreen = () => {
  const [selected, setSelected] = React.useState("");
  const [selectedC, setSelectedC] = React.useState("");
  const [selectedD, setSelectedD] = React.useState("");
  const [modalL, setModalL] = React.useState(false);
  const [enabled, setEnabled] = useState(false);
  const userProfile = useSelector(selectUserProfile);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const rates = useSelector(selectRates);
  const [exchange, setExchange] = useState({
    from: "",
    to: "",
  });
  const [rate, setRate] = useState("");

  const handleSelectCountry = (val:any) => {
    setSelected(val);
    setLoading(true);
    setSelectedD("NGN");
    // let faced_amount = exchange.to;
    let amounted = exchange?.to?.substring(1);
    if (selectedC == "UK") {
      let rated = rates.find((rate:any) => rate.name === "Pounds");
      setRate(`£1 - ₦${rated.amount}`);
      let newAmount = Number(amounted) * rated.amount;
      setExchange({
        ...exchange,
        from: "₦" + newAmount.toFixed(2),
      });
    } else if (selectedC == "CAD") {
      let rated = rates.find((rate:any) => rate.name === "CAD");
      setRate(`$1 - ₦${rated.amount}`);
      let newAmount = Number(amounted) * rated.amount;
      setExchange({
        ...exchange,
        from: "₦" + newAmount.toFixed(2),
      });
    } else if (selectedC == "EUR") {
      let rated = rates.find((rate:any) => rate.name === "Euro");
      setRate(`€1 - ₦${rated.amount}`);
      let newAmount = Number(amounted) * rated.amount;
      setExchange({
        ...exchange,
        from: "₦" + newAmount.toFixed(2),
      });
    } else {
      let rated = rates.find((rate:any) => rate.name === "USD");
      setRate(`$1 - ₦${rated.amount}`);
      let newAmount = Number(amounted) * rated.amount;
      setExchange({
        ...exchange,
        from: "₦" + newAmount.toFixed(2),
      });
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
    // {key:'3', value:'🇬🇧 UK'},
  ];
  const datas = [
    { key: "3", value: "🇺🇸 USA" },
    { key: "4", value: "🇨🇦 CAD" },
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
        const exchangeNewData = {
          from: exchange.from,
          to: exchange.to,
          selectedC,
          selectedD
        }
        dispatch(setExchanger(exchangeNewData));
        router.push({
          pathname: "/ReceiverScreen",
          params: {
            request_type: "payment",
            currency_from: selectedD,
            currency_to: selectedC,
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
    <SafeAreaView
      style={tw`flex-grow justify-center bg-white items-center w-full h-full`}
    >
      <StatusBar style="dark" />
      <ScrollView
        style={tw`h-full w-full ${
          Platform.OS === "ios" ? "p-5 h-full w-full" : "p-5 h-full w-full"
        }`}
      >
        <CustomHeader title={"Send Money"} />

        {/* Currency From section */}
        <View
          style={tw`border border-gray-300 rounded-2xl p-5 w-full flex flex-row mt-5 items-center justify-between`}
        >
          <View style={tw`flex-1 flex-col`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Payout Amount:</Text>

            <TextInput
              value={exchange.to}
              placeholder="0.00"
              onChangeText={(val) => {
                setExchange({
                  ...exchange,
                  to: val,
                });
              }}
              style={tw`mt-4 text-[13px] `}
              keyboardType="number-pad"
            />
          </View>
          <View style={tw`flex-1 pl-5`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Currency:</Text>
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
        </View>
        <Text style={tw`text-gray-400 font-bold text-[11px] mt-3`}>
        This amount will be sent to the receivers account
        </Text>

        <View
          style={tw`mt-4 flex flex-row w-full justify-between items-center`}
        >
          <Text
            style={tw`flex-1 border-r p-3 border-gray-400 text-[10px] font-semibold text-gray-600`}
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
          style={tw`border border-gray-300 rounded-2xl p-5 w-full flex flex-row mt-10 items-center justify-between`}
        >
          <View style={tw`flex-1`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Currency</Text>
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
            <Text style={tw`text-gray-800 text-[12px]`}>Deposit Amount:</Text>

            <TextInput
              value={exchange.from}
              placeholder="0.00"
              onChangeText={(val) => {
                setExchange({
                  ...exchange,
                  from: val,
                });
              }}
              style={tw`mt-4 text-[13px] text-gray-500`}
              editable={false}
              keyboardType="number-pad"
            />
          </View>
        </View>
        
        <Text style={tw`text-gray-400 font-bold text-[10px] mt-3`}>
          Send this amount from your naira bank account to Globees Ex
        </Text>


        <View style={tw`mt-15`}>
        <View style={tw`flex flex-row items-center mb-2`}>
          <Text style={tw`text-gray-600 text-[12px]`}>
            Service charge applies. Check out our{" "}
          </Text>
          <TouchableOpacity onPress={() => setModalL(!modalL)}>
            <Text style={tw`text-[12px] text-blue-600`}>
              Payment Gateway T&Cs
            </Text>
          </TouchableOpacity>
        </View>
          <PrimaryBtn title={"Continue"} onpressed={() => {
            if(exchange.from !== ""){
              setEnabled(true);
            }else{
              alert("Kindly select NGN and complete the required fields to continue");
            }
          }} />
        </View>
        <View style={tw`mt-5`}>
          <Marquee spacing={20} speed={0.3}>
            <Text style={tw`text-[12px] text-gray-800`}>
              Kindly update your identity and complete KYC to make payment or send money.{" "}
              <Text style={tw`font-bold`}>
                {"Goto Home, select More and Complete Identity Verification."}
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
            isLogout={false}
            text={`Are you sure you want to proceed to pay ${exchange.to}?`}
            onPressed={handleExchange}
          />
        ) : null}
        <LoadingModal
          visibility={loading}
          text={"Please wait..."}
        />
        <CustomLegal visibility={modalL} setVisibility={setModalL} />
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
