import React from 'react'
import { View, Text, Modal, TouchableOpacity, Platform, Animated } from 'react-native'
import tw from "twrnc"
import Icon from "@expo/vector-icons/Ionicons"
import { Linking } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { PRIMARY_COLOR } from '@/hooks/api/Index'

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    icon: 'logo-facebook',
    url: 'https://facebook.com/globees_ex',
    color: 'text-blue-600'
  },
  {
    name: 'Twitter',
    icon: 'logo-twitter',
    url: 'https://twitter.com/globees_ex',
    color: 'text-blue-400'
  },
  {
    name: 'Instagram',
    icon: 'logo-instagram',
    url: 'https://www.instagram.com/globees.ex/',
    color: 'text-pink-600'
  },
  {
    name: 'Telegram',
    icon: 'paper-plane',
    url: 'https://t.me/globees_ex',
    color: 'text-blue-500'
  }
];

const CustomSocial = ({visibility, setVisibility}: {visibility: boolean, setVisibility: (value: boolean) => void}) => {
  const handleSocialPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error("Don't know how to open URI: " + url);
      }
    } catch (error) {
      console.error("Error opening link:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibility}
      onRequestClose={() => setVisibility(false)}
    >
      <StatusBar style="dark" />
      <View style={tw`flex-1 bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl mt-auto h-[80%]`}>
          {/* Header */}
          <View style={tw`relative border-b border-gray-100 p-4 ${Platform.OS === "ios" ? "pt-14" : "pt-4"}`}>
            <TouchableOpacity 
              style={tw`absolute right-4 z-10 ${Platform.OS === "ios" ? "top-14" : "top-4"}`} 
              onPress={() => setVisibility(false)}
            >
              <Icon name='close-circle' size={32} color={PRIMARY_COLOR} />
            </TouchableOpacity>
            <Text style={tw`text-center text-xl font-semibold text-[${PRIMARY_COLOR}]`}>
              Connect With Us
            </Text>
          </View>

          {/* Content */}
          <View style={tw`flex-1 p-6 justify-center`}>
            <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-8`}>
              Follow Us on Social Media
            </Text>
            <Text style={tw`text-base text-gray-600 text-center mb-10`}>
              Stay connected with us for updates, news, and support
            </Text>

            <View style={tw`flex-row flex-wrap justify-center gap-6`}>
              {socialLinks.map((social, index) => (
                <TouchableOpacity
                  key={index}
                  style={tw`items-center`}
                  onPress={() => handleSocialPress(social.url)}
                >
                  <View style={tw`bg-gray-50 rounded-full p-4 mb-2 shadow-sm`}>
                    <Icon 
                      name={social.icon as any} 
                      size={32} 
                      style={tw`${social.color}`}
                    />
                  </View>
                  <Text style={tw`text-sm text-gray-600`}>{social.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={tw`p-6 border-t border-gray-100`}>
            <Text style={tw`text-center text-gray-500 text-sm`}>
              Questions? Contact our support team
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CustomSocial