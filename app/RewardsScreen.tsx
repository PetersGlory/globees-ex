import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, RefreshControl, Platform, Dimensions } from 'react-native';
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

const { width } = Dimensions.get('window');

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
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={isLoading} 
              onRefresh={fetchRewardsData}
              tintColor={PRIMARY_COLOR}
            />
          }
        >
          {/* Hero Points Card */}
          <View style={tw`bg-white rounded-3xl py-6 px-4 border border-gray-100 mt-2 mb-6`}>
            <View style={tw`flex-row items-center justify-between mb-6`}>
              <View style={tw`flex-row items-baseline`}>
                <Text style={tw`text-4xl font-bold text-gray-900`}>
                  {formatPoints(totalPoints)}
                </Text>
                <Text style={tw`text-2xl text-gray-900 ml-3`}>pts</Text>
              </View>
              <View style={tw`bg-gray-100 rounded-full p-4`}>
                <FontAwesome5 name="crown" size={28} color={PRIMARY_COLOR} />
              </View>
            </View>

            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View>
                <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>
                  £{pointsToPounds(totalPoints)}
                </Text>
                <Text style={tw`text-gray-900 text-sm`}>Available to withdraw</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.navigate("/InviteFriend")}
                style={tw`bg-white px-3 py-3 rounded-2xl border border-gray-100 shadow-sm`}
                activeOpacity={0.9}
              >
                <View style={tw`flex-row items-center`}>
                  <FontAwesome5 name="user-plus" size={16} color={PRIMARY_COLOR} style={tw`mr-2`} />
                  <Text style={tw`text-sm font-bold text-[${PRIMARY_COLOR}]`}>
                    Invite Friend
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={tw`bg-gray-100 rounded-2xl p-3`}>
              <Text style={tw`text-center text-gray-900 font-medium`}>
                100pts = £1 • Earn more with referrals
              </Text>
            </View>
          </View>

          {/* Stats Cards Row */}
          <View style={tw`flex-row justify-between mb-6`}>
            <View style={tw`bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm border border-gray-100`}>
              <View style={tw`bg-blue-50 w-12 h-12 rounded-xl items-center justify-center mb-3`}>
                <FontAwesome5 name="chart-line" size={20} color="#3b82f6" />
              </View>
              <Text style={tw`text-gray-600 text-sm mb-1`}>This Month</Text>
              <Text style={tw`text-xl font-bold text-gray-900`}>
                {rewardsData.length > 0 ? formatPoints(rewardsData[0]?.transactions.reduce((acc, t) => acc + t.points, 0) || 0) : '0'} pts
              </Text>
            </View>
            
            <View style={tw`bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm border border-gray-100`}>
              <View style={tw`bg-green-50 w-12 h-12 rounded-xl items-center justify-center mb-3`}>
                <FontAwesome5 name="trophy" size={20} color="#10b981" />
              </View>
              <Text style={tw`text-gray-600 text-sm mb-1`}>Total Earned</Text>
              <Text style={tw`text-xl font-bold text-gray-900`}>
                {formatPoints(totalPoints)} pts
              </Text>
            </View>
          </View>

          {/* Enhanced Promotional Banner */}
          <View style={tw`bg-white rounded-2xl p-4 mb-6 border border-gray-100`}>
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-gray-900 font-bold text-lg mb-1`}>
                  🎯 Weekly Challenge
                </Text>
                <Text style={tw`text-gray-900 text-sm`}>
                  Exchange £500+ this week and earn £50 bonus!
                </Text>
              </View>
              <View style={tw`bg-gray-100 w-12 h-12 rounded-full items-center justify-center`}>
                <FontAwesome5 name="star" size={20} color={PRIMARY_COLOR} />
              </View>
            </View>
          </View>

          {/* Transactions List */}
          {rewardsData.length === 0 ? (
            <View style={tw`bg-white rounded-2xl p-8 items-center justify-center border border-gray-100`}>
              <View style={tw`bg-gray-100 w-20 h-20 rounded-full items-center justify-center mb-4`}>
                <FontAwesome5 name="gift" size={32} color="#6b7280" />
              </View>
              <Text style={tw`text-gray-600 text-center font-medium text-lg mb-2`}>
                No rewards yet
              </Text>
              <Text style={tw`text-gray-500 text-center text-sm`}>
                Start earning points by making transactions and inviting friends!
              </Text>
            </View>
          ) : (
            rewardsData.map((monthData, index) => (
              <View key={index} style={tw`mb-6`}>
                <View style={tw`flex-row items-center mb-4`}>
                  <View style={tw`w-2 h-6 bg-blue-500 rounded-full mr-3`} />
                  <Text style={tw`text-lg font-bold text-gray-800`}>
                    {monthData.month}
                  </Text>
                  <View style={tw`flex-1 h-px bg-gray-200 ml-3`} />
                </View>
                
                {monthData.transactions.map((transaction, tIndex) => (
                  <TouchableOpacity 
                    key={tIndex} 
                    style={tw`bg-white p-5 rounded-2xl mb-3 shadow-sm border border-gray-100`}
                    activeOpacity={0.95}
                  >
                    <View style={tw`flex-row items-center justify-between`}>
                      <View style={tw`flex-row items-center flex-1`}>
                        <View style={tw`bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-2xl items-center justify-center mr-4`}>
                          <FontAwesome5 name="coins" size={20} color="#ffffff" />
                        </View>
                        <View style={tw`flex-1`}>
                          <Text style={tw`font-bold text-gray-900 text-base mb-1`}>
                            +{formatPoints(transaction.points)} points earned
                          </Text>
                          <Text style={tw`text-gray-500 text-sm`}>
                            {transaction.date}
                          </Text>
                        </View>
                      </View>
                      <View style={tw`bg-blue-50 px-4 py-2 rounded-full border border-blue-200`}>
                        <Text style={tw`text-blue-700 font-bold text-sm`}>
                          {formatPoints(transaction.points)} pts
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}

          {/* Bottom Spacing */}
          <View style={tw`h-6`} />
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