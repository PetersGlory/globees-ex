import {useState, useEffect, useRef} from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Constants from "expo-constants";

import { Platform } from "react-native";

export interface PushNotifcationState {
    expoPushToken?: Notifications.ExpoPushToken;
    notification?: Notifications.Notification;
}


export const usePushNotification = ():PushNotifcationState =>{
    Notifications.setNotificationHandler({
        handleNotification: async () =>({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false,
        }),
    });

    const [expoPushToken, setExpoPushToken] = useState<
        Notifications.ExpoPushToken | undefined
    >();

    const [notification, setNotification] = useState<
        Notifications.Notification | undefined
    >();

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    async function registerForPushNotificationsAsync() {
        let token;
        if(Device.isDevice){
            const {status:existingStatus} = await Notifications.getPermissionsAsync();
            let finalState = existingStatus;

            if(existingStatus !== "granted"){
                const {status} = await Notifications.requestPermissionsAsync();
                finalState = status;
            }

            if(existingStatus !== "granted"){
                // alert("Failed to get the push token for push notification");
                return;
            }

            token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas.projectId,
            });
        }else{
            alert("Use a real device.");
        }

        if(Platform.OS === "android"){
            Notifications.setNotificationChannelAsync("default",{
                name:"dafault",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0,250,250,250],
                lightColor: "#FF231FC",
            });
        }

        return token;
    }

    useEffect(()=>{
        registerForPushNotificationsAsync().then((token)=>{
            setExpoPushToken(token);
        });

        notificationListener.current = Notifications.addNotificationReceivedListener((notification)=>{
            setNotification(notification);
        });

        responseListener.current  = Notifications.addNotificationReceivedListener((response)=>{
            const pushDta = response
        });

        return ()=>{
            Notifications.removeNotificationSubscription(
                notificationListener.current!
            )
            Notifications.removeNotificationSubscription(
                responseListener.current!
            )
        }
    },[])

    return {
        expoPushToken,
        notification,
    };
}