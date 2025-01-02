import { Tabs } from 'expo-router';
import React from 'react';
import tw from "twrnc"
import { PRIMARY_COLOR } from '@/hooks/api/Index';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {

  return (
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY_COLOR,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 65,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 0 : 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: 5,
        },
        tabBarItemStyle: {
          paddingTop: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" style={tw`mb-1`} color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="ExchangeScreen"
        options={{
          headerShown: false,
          title: 'Exchange',
          tabBarIcon: ({ color }) => <Ionicons name="contract-outline" style={tw`mb-1`} color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="CryptoScreen"
        options={{
          headerShown: false,
          title: 'Crypto',
          tabBarIcon: ({ color }) => <Ionicons name="cash-outline" style={tw`mb-1`} color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="PaymentScreen"
        options={{
          headerShown: false,
          title: 'Payment',
          tabBarIcon: ({ color }) => <Ionicons name="card-outline" style={tw`mb-1`} color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="MoreScreen"
        options={{
          headerShown: false,
          title: 'More',
          tabBarIcon: ({ color }) => <Ionicons name="help-circle-outline" style={tw`mb-1`} color={color} size={20} />,
        }}
      />
    </Tabs>
  );
}
