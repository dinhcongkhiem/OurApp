import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from './ChatScreen';
import ControlScreen from './ControlScreen';
import ProfileScreen from './ProfileScreen';
import { NavigationContainer, getFocusedRouteNameFromRoute, useIsFocused } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements/dist/icons/Icon';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ControlStack = ({ navigation, route }) => {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "Profile") {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);
  return (
    <Stack.Navigator screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}>
      <Stack.Screen name="Control" component={ControlScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}

      />
    </Stack.Navigator>
  );
};

const ChatStack = ({ navigation, route }) => {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "Profile") {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);
  return (

    <Stack.Navigator screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}>
      <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default function HomeScreen() {

  return (
    <Tab.Navigator>
      <Tab.Screen name="Notify" component={ControlStack} options={{ 
          headerShown: false, tabBarIcon: () => <Icon
          name='mood'
          size={25}
          type='material'
        />
       }} />
      <Tab.Screen name="Chat" component={ChatStack} options={{
        headerShown: false, tabBarIcon: () => <Icon
          name='chat'
          size={25}
        />
      }} />
    </Tab.Navigator>
  );
}