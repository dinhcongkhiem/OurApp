import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from 'react-native-elements'
import * as Notifications from 'expo-notifications';
import HomeScreen from './src/screen/HomeScreen'
import 'react-native-gesture-handler';
import LoginStack from './src/screen/LoginScreen'
import { createStackNavigator } from '@react-navigation/stack';
import { registerForPushNotificationsAsync } from './src/service/PushNotification'
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { Text, TouchableOpacity, AppState, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserService from './src/service/UserService'
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
Notifications.setNotificationCategoryAsync('daily_question', [
    {
        identifier: 'reply',
        buttonTitle: 'Reply',
        textInput: { submitButtonTitle: 'Send' },
        options: {
            opensAppToForeground: false,
        },

    },
    {
        identifier: 'no',
        buttonTitle: 'No',
    },

]);


const Stack = createStackNavigator();

export default function App() {
    const appState = React.useRef(AppState.currentState);
    const [appStateVisible, setappStateVisible] = React.useState(appState.current)
    const notificationListener = React.useRef();
    const responseListener = React.useRef();
    React.useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            Alert.alert(String(notification.request.content.title),String(notification.request.content.body));
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
            subscription.remove();
        };

    }, [])
    const handleAppStateChange = (nextAppState) => {
        if (appState.current.match(/inactive|background/) && nextAppState === "active") {
            UserService.UpdateState(true)

        } else {
            UserService.UpdateState(false)
        }
        appState.current = nextAppState;
        setappStateVisible(appState.current)
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <Layout></Layout>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

export const Layout = () => {
    const { authState, onLogout } = useAuth();
    React.useEffect(() => {
    })
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {authState?.authenticated ? (
                    <Stack.Screen name="Home">
                        {props => <HomeScreen {...props} onLogout={onLogout} />}
                    </Stack.Screen>
                ) : (
                    <Stack.Screen name="LoginStack" component={LoginStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
