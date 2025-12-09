import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ROUTES, linkingConfig, type RootStackParamList } from './routes';

import DashboardScreen from 'frontend/screens/Dashboard';
import ProfileScreen from 'frontend/screens/profile/Profile';
import LoginScreen from 'frontend/screens/login/LoginScreen';
import PurchaseRequestScreen from 'frontend/screens/mockups/PurchaseRequestScreen';
import UserManagementScreen from 'frontend/screens/mockups/UserManagementScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name={ROUTES.Dashboard} component={DashboardScreen} />
      <Drawer.Screen name={ROUTES.PurchaseRequest} component={PurchaseRequestScreen} />
      <Drawer.Screen name={ROUTES.UserManagement} component={UserManagementScreen} />
      <Drawer.Screen name={ROUTES.Profile} component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

const UserDrawerNavigator = () => {
    return (
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name={ROUTES.Dashboard} component={DashboardScreen} />
      </Drawer.Navigator>
    );
  };

const StackNavigator = () => {
  return (
    <NavigationContainer linking={linkingConfig} fallback={null}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.Login}>
        <Stack.Screen name={ROUTES.Login} component={LoginScreen} />
        <Stack.Screen name={ROUTES.AdminDrawer} component={AdminDrawerNavigator} />
        <Stack.Screen name={ROUTES.UserDrawer} component={UserDrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
