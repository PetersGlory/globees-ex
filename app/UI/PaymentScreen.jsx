import React, {useState} from 'react'
import { View, Text, SafeAreaView, TextInput,ScrollView } from 'react-native'
import tw from "twrnc"
import { SelectList } from 'react-native-dropdown-select-list'
import CustomHeader from '../Components/common/CustomHeader'
import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import PrimaryBtn from '../Components/common/PrimaryBtn'
import LogOutModal from '../Components/common/Modals/LogOutModal'
import { useDispatch, useSelector } from 'react-redux'
import { selectRates, setExchanger } from '../config/redux/slice'
import LoadingModal from '../Components/common/Modals/LoadingModal'

const PaymentScreen = ({navigation}) => {
  const [selected, setSelected] = React.useState("");
  const [selectedC, setSelectedC] = React.useState("");
  const [selectedD, setSelectedD] = React.useState("");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const rates = useSelector(selectRates)
  const [exchange, setExchange] = useState({
    from: "₦",
    to: "£"
  })
  const [rate, setRate] = useState("")
  const handleSelectCountry =(val) =>{
    setSelected(val);
    if(val == "🇳🇬 NGN" ){
      setExchange({
        to: "",
        from: "₦"
      });
      setSelectedD("NGN")
    }else{
      setExchange({
        to: "",
        from: "£"
      });
      setSelectedD("UK")
    }
  }

  const handleSelectTo =(val) =>{
    setLoading(true);
    setSelected(val);
    let faced_amount = exchange.from;
    let amounted = faced_amount.substring(1);
    if(val == "🇳🇬 NGN" ){
      if(val == "🇳🇬 NGN" && exchange.from[0] == "₦"){
        setRate("£1 - ₦1")        
        setExchange({
          ...exchange,
          to: "₦"+amounted
        });
      }else{
        setRate("£1 - ₦1240")
        let newAmount = eval(Number(amounted) * 1240);
        // alert(newAmount);
        setExchange({
          ...exchange,
          to: "₦"+newAmount.toFixed(2)
        });
        setSelectedC("NGN")
      }
    }else if(val == "🇬🇧 UK" ){
      if(val == "🇬🇧 UK" && exchange.from == "£"){
        setRate("£1 - £1")
        setExchange({
          ...exchange,
          to: "£"+amounted
        });
      }else{
        let rated = rates.find(rate => rate.name === "Euro")
        setRate(`£1 - ₦${rated.amount}`)
        let newAmount = eval(Number(amounted) / rated.amount);
        // alert();
        setExchange({
          ...exchange,
          to: "£"+newAmount.toFixed(2)
        });
        setSelectedC("UK")
      }
    }else if(val == "🇨🇦 CAD"){
      if(exchange.from == "$"){
        setRate("$1 - $1")
        setExchange({
          ...exchange,
          to: "$"+amounted
        });
        setSelectedC("USA")
      }else{
        let rated = rates.find(rate => rate.name === "CAD")
        setRate(`$1 - ₦${rated.amount}`);
        let newAmount = eval(Number(amounted) / rated.amount);
        // alert();
        setExchange({
          ...exchange,
          to: "$"+newAmount.toFixed(2)
        });
        setSelectedC("CAD")
      }
    }else{
      let rated = rates.find(rate => rate.name === "Usd")
        setRate(`$1 - ₦${rated.amount}`);
        let newAmount = eval(Number(amounted) / rated.amount);
        // alert();
        setExchange({
          ...exchange,
          to: "$"+newAmount.toFixed(2)
        });
        setSelectedC("CAD")
    }

    setTimeout(()=>{      
      setLoading(false);
    }, 1000)
  }

  const data = [
    {key:'2', value:'🇳🇬 NGN'},
    // {key:'3', value:'🇬🇧 UK'},
  ]
  const datas = [
    {key:'3', value:'🇺🇸 USA'},
    {key:'4', value:'🇨🇦 CAD'},
    {key:'5', value:'🇬🇧 UK'},
  ]
  const handleExchange = () => {
    setEnabled(false);
    if(exchange.from !== "" || exchange.from.length >0 && exchange.to !== "" || exchange.to.length >0 ){
      dispatch(setExchanger(exchange));
      navigation.push("ReceiverScreen", {
        request_type: "payment",
        currency_from: selectedD,
        currency_to: selectedC
      })
    }else{
      alert('All fields are required.')
    }
  }
  return (
    <SafeAreaView style={tw`flex-grow w-full h-full`}>
      <StatusBar style="dark" />
      <ScrollView style={tw`h-full w-full ${Platform.OS === "ios" ? "p-5 h-full w-full" : "p-5 h-full w-full"}`}>
        <CustomHeader title={"Send Money"} />

        {/* Currency From section */}
        <View style={tw`border border-gray-300 rounded-2xl p-5 w-full flex flex-row mt-10 items-center justify-between`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Currency</Text>
            <SelectList 
                setSelected={(val) => {
                  handleSelectCountry(val)
                }}
                boxStyles={{
                  width:100,
                  marginTop:8,
                  height: 40,
                  padding:2
                }}
                data={data}
                save='value' />
          </View>
          <View style={tw`flex-1 pl-5 flex-col`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Amount:</Text>

            <TextInput value={exchange.from} placeholder='0.00' onChangeText={(val)=>{
              setExchange({
                ...exchange,
                from:val
              });
            }} style={tw`mt-4 text-[13px] `} keyboardType='number-pad'  />
          </View>
        </View>

        <View style={tw`mt-4 flex flex-row w-full justify-between items-center`}>
          <Text style={tw`flex-1 border-r p-3 border-gray-400 text-[10px] text-gray-600`}>Rate : {rate}</Text>
          <Text style={tw`flex-1 text-center text-[12px]`}>- To -</Text>
          <Text style={tw`flex-1 border-l p-3 border-gray-400 text-[10px] text-gray-600`}>Within minutes</Text>
        </View>

        {/* Currency To section */}
        <View style={tw`border border-gray-300 rounded-2xl p-5 w-full flex flex-row mt-5 items-center justify-between`}>
          <View style={tw`flex-1 flex-col`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Amount:</Text>

            <TextInput value={exchange.to} placeholder='0.00' onChangeText={(val)=>{
              setExchange({
                ...exchange,
                to:val
              });
            }} style={tw`mt-4 text-[13px] `} editable={false} keyboardType='number-pad'  />
          </View>
          <View style={tw`flex-1 pl-5`}>
            <Text style={tw`text-gray-800 text-[12px]`}>Currency:</Text>
            <SelectList 
                setSelected={(val) => {
                  handleSelectTo(val)
                }}
                boxStyles={{
                  width:100,
                  marginTop:8,
                  height: 40,
                  padding:2
                }}
                data={datas}
                save='value' />
          </View>
        </View>

        <Text style={tw`text-gray-600 text-sm mt-2`}>10% Service Charge applies</Text>
        
        <View style={tw`mt-15`}>
          <PrimaryBtn title={"Continue"} onpressed={()=> setEnabled(true)} />
        </View>
      </ScrollView>

      {enabled ? <LogOutModal visibility={enabled} setVisibility={setEnabled} text={`Are you sure you want to proceed to pay ${exchange.to}?`} onPressed={handleExchange} /> : null}
      <LoadingModal visibility={loading} setVisibility={()=>setLoading(false)} message={"Please wait..."} isloading={true} />
    </SafeAreaView>
  )
}

export default PaymentScreen