import CustomHeader from '@/components/common/CustomHeader';
import { PRIMARY_COLOR } from '@/hooks/api/Index';
import { Marquee } from '@animatereactnative/marquee';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import tw from 'twrnc';

const RewardsScreen = () => {
  const rewardsData = [
    {
      month: 'Oct 2024',
      transactions: [
        { points: 101.00, date: 'Oct 27, 05:31 PM' },
        { points: 47.00, date: 'Oct 27, 04:33 PM' },
      ]
    },
    {
      month: 'Sep 2024',
      transactions: [
        { points: 10.00, date: 'Sep 27, 12:21 PM' },
      ]
    }
  ];

  return (
    <SafeAreaView style={tw`flex-grow w-full h-full px-4 py-4 gap-4 bg-gray-50 `}>
      {/* Header */}
        <CustomHeader title={"Rewards"} />

      <ScrollView style={tw`flex-1`}>
        {/* Points Card */}
        <View style={tw`bg-white rounded-xl p-4 gap-2 shadow-sm`}>
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-baseline`}>
              <Text style={tw`text-4xl font-bold`}>158.00</Text>
              <Text style={tw`text-xl text-gray-400 ml-2`}>pts</Text>
            </View>
            <View style={tw`bg-gray-100 rounded-full p-2`}>
              <FontAwesome5 name="coins" size={24} color={PRIMARY_COLOR} />
            </View>
          </View>
          <View style={tw`w-full flex flex-row items-center justify-between`}>
            <Text style={tw`text-base font-bold mt-2`}>£1.58</Text>
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

