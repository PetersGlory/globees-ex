import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, RefreshControl, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';
import { Marquee } from '@animatereactnative/marquee';
import axios from 'axios';
import { router } from 'expo-router';
import tw from 'twrnc';
import CustomHeader from '@/components/common/CustomHeader';
import { BASE_URL, PRIMARY_COLOR } from '@/hooks/api/Index';
import { selectAccessToken } from '@/hooks/redux/slice';
import LoadingModal from '@/components/common/Modals/LoadingModal';

interface Transaction {
  points: number;
  date: string;
}

interface RewardsData {
  month: string;
  transactions: Transaction[];
}

const RewardsScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rewardsData, setRewards] = useState<RewardsData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userToken = useSelector(selectAccessToken);

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const fetchRewardsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/get-points`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      setRewards(response.data.message);
    } catch (err) {
      console.error("Error fetching rewards:", err);
      setError("Failed to load rewards data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPoints = rewardsData.reduce((acc, monthData) => {
    return acc + monthData.transactions.reduce((monthAcc, transaction) => monthAcc + transaction.points, 0);
  }, 0);

  const formatPoints = (points: number) => points.toFixed(2);
  const pointsToPounds = (points: number) => (points / 100).toFixed(2);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-1 px-4 ${Platform.OS === "ios" ? "pt-5" : "pt-6"}`}>
        <CustomHeader title="Rewards" />
        
        <ScrollView 
          style={tw`flex-1`}
          refreshControl={
            <RefreshControl 
              refreshing={isLoading} 
              onRefresh={fetchRewardsData}
              tintColor={PRIMARY_COLOR}
            />
          }
        >
          {/* Points Summary Card */}
          <View style={tw`bg-white rounded-xl p-6 shadow-sm mb-4`}>
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View style={tw`flex-row items-baseline`}>
                <Text style={tw`text-4xl font-bold text-gray-900`}>
                  {formatPoints(totalPoints)}
                </Text>
                <Text style={tw`text-xl text-gray-400 ml-2`}>pts</Text>
              </View>
              <View style={tw`bg-gray-100 rounded-full p-3`}>
                <FontAwesome5 name="coins" size={24} color={PRIMARY_COLOR} />
              </View>
            </View>

            <View style={tw`flex-row items-center justify-between mb-2`}>
              <Text style={tw`text-lg font-semibold text-gray-900`}>
                £{pointsToPounds(totalPoints)}
              </Text>
              <TouchableOpacity 
                onPress={() => router.navigate("/InviteFriend")}
                style={tw`flex-row items-center px-4 py-2 rounded-xl border border-[${PRIMARY_COLOR}]`}
              >
                <FontAwesome5 name="user-plus" size={14} color={PRIMARY_COLOR} style={tw`mr-2`} />
                <Text style={tw`text-sm font-medium text-[${PRIMARY_COLOR}]`}>
                  Invite Friend
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={tw`text-xs text-gray-400 text-center font-medium`}>
              100pts = £1
            </Text>
          </View>

          {/* Promotional Banner */}
          <View style={tw`bg-blue-50 rounded-xl p-3 mb-6`}>
            <Marquee spacing={20} speed={0.3}>
              <Text style={tw`text-sm text-blue-800 font-medium`}>
                Earn £50 if you exchange up to £500 a week.
              </Text>
            </Marquee>
          </View>

          {/* Transactions List */}
          {error ? (
            <View style={tw`items-center justify-center p-4`}>
              <Text style={tw`text-red-500 text-center`}>{error}</Text>
              <TouchableOpacity 
                onPress={fetchRewardsData}
                style={tw`mt-2 px-4 py-2 bg-gray-100 rounded-lg`}
              >
                <Text style={tw`text-gray-700`}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : rewardsData.length === 0 ? (
            <View style={tw`items-center justify-center p-4`}>
              <Text style={tw`text-gray-500 text-center`}>No rewards history yet</Text>
            </View>
          ) : (
            rewardsData.map((monthData, index) => (
              <View key={index} style={tw`mb-6`}>
                <Text style={tw`text-base font-semibold text-gray-500 mb-3`}>
                  {monthData.month}
                </Text>
                {monthData.transactions.map((transaction, tIndex) => (
                  <View 
                    key={tIndex} 
                    style={tw`flex-row items-center justify-between bg-white p-4 rounded-xl mb-3 shadow-sm`}
                  >
                    <View style={tw`flex-row items-center`}>
                      <View style={tw`bg-gray-100 rounded-full p-2 mr-3`}>
                        <FontAwesome5 name="coins" size={18} color={PRIMARY_COLOR} />
                      </View>
                      <View>
                        <Text style={tw`font-medium text-gray-900`}>
                          You earned {formatPoints(transaction.points)} pts
                        </Text>
                        <Text style={tw`text-gray-500 text-xs`}>
                          {transaction.date}
                        </Text>
                      </View>
                    </View>
                    <View style={tw`bg-blue-50 px-3 py-2 rounded-full`}>
                      <Text style={tw`text-blue-700 font-medium`}>
                        {formatPoints(transaction.points)} pts
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <LoadingModal 
        visibility={isLoading}
        text="Loading rewards..."
      />
    </SafeAreaView>
  );
};

export default RewardsScreen;

