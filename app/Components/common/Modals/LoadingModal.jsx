import React from 'react'
import { View, Text, StyleSheet, Modal, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import { PRIMARY_COLOR } from '../../../config/api/Index';

const LoadingModal = ({visibility, setVisibility, isloading, message}) => {
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visibility}
        onRequestClose={() => {
        setVisibility(false);
    }}>
        <View style={styles.centeredView}>
            {isloading ? <View style={styles.modalView}>
                
                <ActivityIndicator size="large" color="#1D3A70" />
                <TouchableOpacity onPress={()=> {
                    setVisibility(false);
                }}>
                <Text style={styles.modalText}>{message}</Text>
                </TouchableOpacity>
            </View> :
            <View>
                
                <View style={styles.modalView}>
                    
                    <Image source={require('../../../../assets/img/success-bg.png')} style={{
                        width: 80,
                        height:80
                    }} alt={'completed'} />
                    <TouchableOpacity onPress={()=> {
                        setVisibility(false);
                    }}>
                        <Text style={styles.modalText}>{message}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            }
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
        backgroundColor: PRIMARY_COLOR,
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
        textAlign: 'center',
        fontSize:14,
        fontWeight: "500",
        marginTop: 18.38,
        color: "#393836"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
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
export default LoadingModal