import axios from 'axios';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {  Platform } from 'react-native';
import Constants from 'expo-constants';

const EXPO_SERVER_URL = 'https://exp.host/--/api/v2/push/send'
export const sendPushNotification = async (expoPushToken: String, title: String, message: String) => {
    if (expoPushToken == null) {
        return null;
    }
    let data = JSON.stringify({
        "to": expoPushToken,
        "sound": 'default',
        "title": title,
        "body": message
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: EXPO_SERVER_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    
    axios.request(config)
}


export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        // token = await Notifications.getExpoPushTokenAsync({
        //     projectId: Constants.expoConfig.extra.eas.projectId,
        //     applicationId: "1:142811575834:android:0fb7a6cdfd9b1ce61283a3",
        // });
        token = await Notifications.getDevicePushTokenAsync();
        console.log(token);
        
        
    } else {
        alert('Must use physical device for Push Notifications');
    }
    
    return token.data;
}
