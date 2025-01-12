import React from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import Icon from "@expo/vector-icons/Ionicons"
import tw from "twrnc"
import { PRIMARY_COLOR } from '@/hooks/api/Index'

const LogOutModal = ({visibility, setVisibility, text, onPressed}:any) => {
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visibility}
        onRequestClose={() => {
        setVisibility(false);
    }}>
        <View style={styles.centeredView}>            
            <View style={styles.modalView}>                
                <Icon name="help-circle-outline" size={50} style={{
                    ...tw`text-[${PRIMARY_COLOR}]`,
                }} />
                <Text style={tw`text-center text-gray-700 text-[14px]`}>{text}</Text>
                <View style={tw`flex flex-row items-center justify-between p-2 mt-2 w-full`}>
                    <TouchableOpacity onPress={()=> {
                        setVisibility(false);
                    }} style={tw`border border-gray-600 rounded-lg p-3 w-[100px]`}>
                        <Text style={tw`text-gray-700 text-center`}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressed} style={tw`bg-[${PRIMARY_COLOR}] rounded-lg p-3 w-[100px]`}>
                        <Text style={tw`text-white text-center`}>Yes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    dflex: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginTop: 20,
    },

    btnPrimary:{
        backgroundColor: "#028C25",
        borderRadius: 5,
        color: "#ffffff",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        width:"100%",
        height:45,
        marginTop: 34
    },
    modalText: {
        marginBottom: 15,
        fontWeight: "500",
        marginTop: 18.38,
        color: "#393836"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 22,
        backgroundColor: "rgba(0, 0, 0, 0.5);"
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        width:"80%",
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
export default LogOutModal