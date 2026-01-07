import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ROUTES, linkingConfig, type RootStackParamList } from './routes';
import { AuthProvider, useAuth } from '../../backend/context/AuthContext';

import DashboardScreen from 'frontend/screens/Dashboard';
import ProfileScreen from 'frontend/screens/profile/Profile';
import LoginScreen from 'frontend/screens/login/LoginScreen';
import ItemRegistrationScreen from 'frontend/screens/inventory/ItemRegistrationScreen';
import UserManagementScreen from 'frontend/screens/system/UserManagementScreen';
import SupplierListScreen from 'frontend/screens/system/SupplierListScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name={ROUTES.Dashboard} component={DashboardScreen} />
      <Drawer.Screen name={ROUTES.UserManagement} component={UserManagementScreen} />
      <Drawer.Screen name={ROUTES.ItemRegistration} component={ItemRegistrationScreen} />
      <Drawer.Screen name={ROUTES.SupplierList} component={SupplierListScreen} />
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

const RootNavigator = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    // TODO: replace with a branded splash/loading screen if desired
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!session ? (
        <Stack.Screen name={ROUTES.Login} component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name={ROUTES.AdminDrawer} component={AdminDrawerNavigator} />
          {/* <Stack.Screen name={ROUTES.UserDrawer} component={UserDrawerNavigator} /> */}
        </>
      )}
    </Stack.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer linking={linkingConfig} fallback={null}>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default StackNavigator;
