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
            shouldShowBanner: true,
            shouldShowList: true,
            shouldSetBadge: false,
        }),
    });

    const [expoPushToken, setExpoPushToken] = useState<
        Notifications.ExpoPushToken | undefined
    >();

    const [notification, setNotification] = useState<
        Notifications.Notification | undefined
    >();

    const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
    const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

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
            console.log("Use a real device.");
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

        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any)=>{
            setNotification(notification);
        });

        responseListener.current  = Notifications.addNotificationReceivedListener((response: any)=>{
            const pushDta = response
        });

        return ()=>{
            notificationListener.current?.remove();
            responseListener.current?.remove();
        }
    },[])

    return {
        expoPushToken,
        notification,
    };
}