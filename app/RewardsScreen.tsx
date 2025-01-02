import CustomHeader from '@/components/common/CustomHeader';
import { BASE_URL, PRIMARY_COLOR } from '@/hooks/api/Index';
import { selectAccessToken } from '@/hooks/redux/slice';
import { Marquee } from '@animatereactnative/marquee';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import tw from 'twrnc';

// Define the interface for Transaction
interface Transaction {
  points: number;
  date: string;
}

// Define the interface for RewardsData
interface RewardsData {
  month: string;
  transactions: Transaction[];
}

const RewardsScreen = () => {
  const [loading, setLoading] = useState(false);
  const userToken = useSelector(selectAccessToken);
  const [rewardsData, setRewards] = useState<RewardsData[]>([]);

  useEffect(()=>{
    onLoading();
  },[])

  const onLoading = async () => {
    setLoading(true);
    try{
      axios
      .request({
        method: "GET",
        url: `${BASE_URL}/get-points`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      })
      .then((response:any) => {
        setRewards(response.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
    }catch(err:any){
      console.log(err)
    }finally{
      setLoading(false);
    }
  }

  // New variable to hold the total points
  const totalPoints = rewardsData.reduce((acc, monthData) => {
    return acc + monthData.transactions.reduce((monthAcc, transaction) => monthAcc + transaction.points, 0);
  }, 0);

  return (
    <SafeAreaView style={tw`flex-grow w-full h-full px-4 py-5 gap-4 bg-gray-50 `}>
      {/* Header */}
      <CustomHeader title={"Rewards"} />

      <ScrollView style={tw`flex-1`} refreshControl={<RefreshControl refreshing={loading} onRefresh={onLoading} />} >
        {/* Points Card */}
        <View style={tw`bg-white rounded-xl p-4 gap-2 shadow-sm`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-baseline`}>
              <Text style={tw`text-4xl font-bold`}>{totalPoints.toFixed(2)}</Text>
              <Text style={tw`text-xl text-gray-400 ml-2`}>pts</Text>
            </View>
            <View style={tw`bg-gray-100 rounded-full p-2`}>
              <FontAwesome5 name="coins" size={24} color={PRIMARY_COLOR} />
            </View>
          </View>
          <View style={tw`w-full flex flex-row items-center justify-between`}>
            <Text style={tw`text-base font-bold mt-2`}>£{totalPoints.toFixed(2)}</Text>
            <TouchableOpacity onPress={()=> router.navigate("/InviteFriend")} style={tw`items-center py-2 px-4 rounded-xl border border-[${PRIMARY_COLOR}]`}>
            <Text style={tw`text-sm`}>Invite Friend</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={tw`mt-5`}>
          <Marquee spacing={20} speed={0.3}>
            <Text style={tw`text-[12px] text-gray-800`}>
                Earn £50 if you exchange upto £500 a week.
            </Text>
          </Marquee>
        </View>

        {/* Transactions List */}
        {rewardsData.map((monthData, index) => (
          <View key={index} style={tw`mt-4`}>
            <Text style={tw`text-base font-semibold text-gray-500 mb-4`}>{monthData.month}</Text>
            {monthData.transactions.map((transaction, tIndex) => (
              <View 
                key={tIndex} 
                style={tw`flex-row items-center justify-between bg-white p-4 rounded-xl mb-3`}
              >
                <View style={tw`flex-row items-center`}>
                  <View style={tw`bg-gray-100 rounded-full p-2 mr-3`}>
                    <FontAwesome5 name="coins" size={18} color={PRIMARY_COLOR} />
                  </View>
                  <View>
                    <Text style={tw`font-medium`}>You earned {transaction.points} pts</Text>
                    <Text style={tw`text-gray-500 text-xs`}>{transaction.date}</Text>
                  </View>
                </View>
                <View style={tw`bg-blue-50 px-3 py-2 rounded-full`}>
                  <Text style={tw`text-blue-700`}>{transaction.points} pts</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RewardsScreen;

