import React, {useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './app/config/redux/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroScreen from './app/UI/IntroScreen';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './app/UI/Authentication/LoginScreen';
import VerificationScreen from './app/UI/Authentication/VerificationScreen';
import RegistrationScreen from './app/UI/Authentication/RegistrationScreen';
import ForgotPassword from './app/UI/Authentication/ForgotPassword';
import IndexHome from './app/UI/IndexHome';
import ExchangeScreen from './app/UI/ExchangeScreen';
import TransactionScreen from './app/UI/TransactionScreen';
import NotificationScreen from './app/UI/NotificationScreen';
import AccountDetails from './app/UI/AccountDetails';
import MoreScreen from './app/UI/MoreScreen';
import ProfileScreen from './app/UI/ProfileScreen';
import PaymentScreen from './app/UI/PaymentScreen';
import AccountLimits from './app/UI/AccountLimits';
import ReceiverScreen from './app/UI/ReceiverScreen';
import SummaryScreen from './app/UI/SummaryScreen';
import SuccessTransaction from './app/Components/common/Modals/SuccessTransaction';
import WelcomeScreen from './app/UI/WelcomeScreen';
import { usePushNotification } from './usePushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoScreen from './app/UI/CryptoScreen';
import CryptoSuccessPage from './app/Components/common/Modals/CryptoSuccessPage';
// import registerNNPushToken from 'native-notify';

const Stack = createNativeStackNavigator();
export default function App() {
  // registerNNPushToken(14312, 'NRKYt9PycbIzkLWoNHDK1o');
  const {expoPushToken} = usePushNotification();
  useEffect(() => {
    setPush()
  });

  const setPush = async () =>{
    console.log(expoPushToken?.data)
    await AsyncStorage.setItem("pushToken", expoPushToken?.data);
  }
  
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <NavigationContainer>
      <Stack.Navigator
        initialRouteName='WelcomeScreen'
        screenOptions={{
          headerShown:false,
        }}>
          <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} />
          <Stack.Screen name='IntroScreen' component={IntroScreen} />
          <Stack.Screen name='LoginScreen' component={LoginScreen} />
          <Stack.Screen name='VerificationScreen' component={VerificationScreen} />
          <Stack.Screen name='RegistrationScreen' component={RegistrationScreen} />
          <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
          <Stack.Screen name='HomeScreen' component={IndexHome} />
          <Stack.Screen name='ExchangeScreen' component={ExchangeScreen} />
          <Stack.Screen name='TransactionScreen' component={TransactionScreen} />
          <Stack.Screen name='NotificationScreen' component={NotificationScreen} />
          <Stack.Screen name='AccountDetails' component={AccountDetails} />
          <Stack.Screen name='AccountLimits' component={AccountLimits} />
          <Stack.Screen name='MoreScreen' component={MoreScreen} />
          <Stack.Screen name='ProfileScreen' component={ProfileScreen} />
          <Stack.Screen name='PaymentScreen' component={PaymentScreen} />
          <Stack.Screen name='CryptoScreen' component={CryptoScreen} />
          <Stack.Screen name='CryptoSuccess' component={CryptoSuccessPage} />
          <Stack.Screen name='ReceiverScreen' component={ReceiverScreen} />
          <Stack.Screen name='SummaryScreen' component={SummaryScreen} />
          <Stack.Screen name='SuccesScreen' component={SuccessTransaction} />
      </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
