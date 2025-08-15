import React, { useState, useCallback } from 'react'
import { Text, View, Modal, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import tw from "twrnc"
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import { shareAsync } from "expo-sharing"
import { captureRef } from "react-native-view-shot"
import { useRef } from 'react';
import { selectUserProfile } from '@/hooks/redux/slice';
import { NumberFormatter, PRIMARY_COLOR } from '@/hooks/api/Index';

interface TransactionModalProps {
  onpressed: () => void;
  visibility: boolean;
  data: any;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ onpressed, visibility, data }) => {
  const usersProfile = useSelector(selectUserProfile);
  const viewTosnapShotRef = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(true);

  const PrintAsPDF = useCallback(async () => {
    if (!viewTosnapShotRef.current) {
      console.error("No view reference found");
      return;
    }

    try {
      setIsCapturing(false);
      
      // Give time for the UI to update
      await new Promise(resolve => setTimeout(resolve, 500));

      const uri = await captureRef(viewTosnapShotRef, {
        format: "jpg",
        quality: 0.8,
        result: "tmpfile",
        height: 1920,
        width: 1080,
        // snapshotContentContainer: true
      });

      console.log("Receipt captured at:", uri);
      
      await shareAsync(uri, { 
        UTI: '.jpg', 
        mimeType: 'image/jpeg',
        dialogTitle: 'Share Transaction Receipt'
      }).then(() => {
        console.log("Receipt shared successfully");
      }).catch((error) => {
        console.error("Failed to share receipt:", error);
        alert('Failed to share receipt. Please try again.');
      });

    } catch (error) {
      console.error("Failed to capture receipt:", error);
      alert('Failed to capture receipt. Please try again.');
    } finally {
      setIsCapturing(true);
    }
  }, [viewTosnapShotRef]);

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'successful':
      case 'completed':
        return {
          container: 'bg-green-100',
          text: 'text-green-700'
        };
      case 'pending':
        return {
          container: 'bg-yellow-100',
          text: 'text-yellow-700'
        };
      default:
        return {
          container: 'bg-red-100',
          text: 'text-red-700'
        };
    }
  };

  const statusStyle = getStatusStyle(data?.status);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibility}
      onDismiss={onpressed}>
      <View style={tw`flex-1 justify-center items-center bg-black/70`}>
        <TouchableOpacity 
          style={tw`absolute ${Platform.OS === "ios" ? "top-20" : "top-5"} right-5 z-40`} 
          onPress={onpressed}
        >
          <Ionicons name='close-circle' size={32} color="#000000" />
        </TouchableOpacity>
        
        <View style={tw`bg-white rounded-2xl w-[99%] max-h-[100%] overflow-hidden shadow-2xl`}>
          <View 
            ref={viewTosnapShotRef} 
            collapsable={false}
            style={tw`bg-white`}
          >
            <ScrollView 
              style={tw`p-5`} 
              showsVerticalScrollIndicator={false}
              scrollEnabled={isCapturing}
              contentContainerStyle={tw`pb-4`}
            >
              {/* Header */}
              <View style={tw`items-center mb-4`}>
                <Image 
                  source={require("../../../assets/images/logo-bg.png")} 
                  style={tw`w-20 h-20 rounded-full`}
                  alt='Avatar'
                />
                <Text style={tw`text-xl font-bold text-gray-800 mt-2`}>Globees Ex</Text>
                <Text style={tw`text-sm text-gray-500`}>Transaction Receipt</Text>
              </View>

              {/* Status Badge */}
              <View style={tw`items-center mb-6`}>
                <View style={tw`${statusStyle.container} px-6 py-2 rounded-full`}>
                  <Text style={tw`${statusStyle.text} font-semibold text-base`}>
                    {data?.status?.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Transaction Details */}
              <View style={tw`bg-gray-50 rounded-xl p-4 mb-4`}>
                <View style={tw`flex-row justify-between items-center mb-4 pb-2 border-b border-gray-200`}>
                  <Text style={tw`text-gray-500 text-base`}>Transaction ID</Text>
                  <Text style={tw`text-gray-800 text-base font-medium`}>{data?.id || 'N/A'}</Text>
                </View>
                <DetailRow label="From" value={usersProfile?.fullname} />
                <DetailRow label="To" value="Globees Ex" />
                <DetailRow label="Date" value={new Date(data?.created_at).toDateString()} />
                <DetailRow label="Send" value={data?.amountsend} />
                <DetailRow 
                  label="Received" 
                  value={data?.category !== "crypto" ? data?.amountreceive : NumberFormatter(parseInt(data?.amountreceive))} 
                />
                <DetailRow label="Transaction Type" value={data?.category?.toUpperCase()} />
              </View>

              {/* Additional Details */}
              <View style={tw`bg-gray-50 rounded-xl p-4 mb-4`}>
                <Text style={tw`text-gray-800 font-semibold mb-3 text-lg`}>Additional Information</Text>
                <DetailRow label="Receiver Name" value={data?.receiver_name?.toUpperCase()} />
                <DetailRow label="Bank Name" value={data?.bank_name?.toUpperCase()} />
                <DetailRow label="Account Number" value={data?.account_number} />

                {(data?.category !== "exchange" && data?.category !== "crypto") && (
                  <>
                    <DetailRow label="Payment Reason" value={data?.payment_reason?.toUpperCase()} />
                    <DetailRow label="Student ID" value={data?.student_id || "N/A"} />
                    <DetailRow label="IBAN" value={data?.iban || "N/A"} />
                    <DetailRow label="Swift/BIC" value={data?.swift_bic || "N/A"} />
                  </>
                )}
              </View>

              {/* Description */}
              <View style={tw`bg-gray-50 rounded-xl p-4 mb-6`}>
                <Text style={tw`text-gray-800 font-semibold mb-2 text-base`}>Description</Text>
                <Text style={tw`text-gray-600 text-sm leading-5`}>
                  Transaction of {data?.amountsend} made to GlobeesEx for {data?.category}
                </Text>
              </View>

              {/* Footer */}
              <View style={tw`items-center mb-10`}>
                <Text style={tw`text-gray-500 text-xs`}>Thank you for using Globees Ex</Text>
                <Text style={tw`text-gray-500 text-xs`}>This is an official receipt</Text>
              </View>

              {isCapturing && (
                <View style={tw`w-full flex flex-row justify-between p-4 mb-8 border-t border-gray-200 bg-white z-40`}>
                  <TouchableOpacity 
                    onPress={onpressed}
                    style={tw`border border-[${PRIMARY_COLOR}] rounded-lg w-[45%] py-3 items-center`}
                  >
                    <Text style={tw`text-[${PRIMARY_COLOR}] font-semibold`}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={PrintAsPDF}
                    style={tw`bg-[${PRIMARY_COLOR}] rounded-lg w-[53%] flex-row justify-center items-center py-3`}
                  >
                    <Ionicons name='share-social-outline' color="#fff" size={20} />
                    <Text style={tw`text-white font-semibold ml-2`}>Share</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <View style={tw`flex-row justify-between items-center py-2`}>
    <Text style={tw`text-gray-500 text-base`}>{label}</Text>
    <Text style={tw`text-gray-800 text-base font-medium text-right`}>
      {value}
    </Text>
  </View>
);

export default TransactionModal;