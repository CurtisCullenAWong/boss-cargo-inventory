import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LayoutScreen from 'frontend/screens/Layout';
import ProfileScreen from 'frontend/screens/profile/Profile';

type RootStackParamList = {
  Layout: undefined;
  Profile: undefined;
  AdminDrawer: undefined;
  UserDrawer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Layout" component={LayoutScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

const UserDrawerNavigator = () => {
    return (
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Layout" component={LayoutScreen} />
      </Drawer.Navigator>
    );
  };

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminDrawer" component={AdminDrawerNavigator} />
        {/* <Stack.Screen name="UserDrawer" component={UserDrawerNavigator} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
