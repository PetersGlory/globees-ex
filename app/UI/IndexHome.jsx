import React from 'react'
import { View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './HomeScreen';
import Ionicons from '@expo/vector-icons/Ionicons'
import ExchangeScreen from './ExchangeScreen';
import MoreScreen from './MoreScreen';
import PaymentScreen from './PaymentScreen';
import tw from 'twrnc'
import CryptoScreen from './CryptoScreen';

const Tab = createBottomTabNavigator();

const IndexHome = () => {
  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{headerShown:false}}>
        <Tab.Screen name='Home' component={HomeScreen}  options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" style={tw`mb-1`} color={color} size={20} />
            ),
        }} />
        <Tab.Screen name='Exchange' component={ExchangeScreen}  options={{
            tabBarLabel: 'Exchange',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="contract-outline" style={tw`mb-1`} color={color} size={20} />
            ),
        }} />
        <Tab.Screen name='Payment' component={PaymentScreen}  options={{
            tabBarLabel: 'Payment',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="card-outline" style={tw`mb-1`} color={color} size={20} />
            ),
        }} />
        <Tab.Screen name='Crypto' component={CryptoScreen}  options={{
            tabBarLabel: 'Crypto',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cash-outline" style={tw`mb-1`} color={color} size={20} />
            ),
        }} />
        <Tab.Screen name='More' component={MoreScreen}  options={{
            tabBarLabel: 'More',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="help-circle-outline" style={tw`mb-1`} color={color} size={20} />
            ),
        }} />
    </Tab.Navigator>
  )
}

export default IndexHome