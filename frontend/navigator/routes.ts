import { type LinkingOptions, type NavigationProp } from '@react-navigation/native';
import * as Linking from 'expo-linking';

export const ROUTES = {
  Login: 'Login',
  AdminDrawer: 'Admin Dashboard',
  UserDrawer: 'User Dashboard',
  Dashboard: 'Dashboard',
  Profile: 'Profile',
  ItemRegistration: 'Item Registration',
  PurchaseRequest: 'Purchase Request',
  UserManagement: 'User Management',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
export type DrawerRouteName = Exclude<
  RouteName,
  | typeof ROUTES.Login
  | typeof ROUTES.AdminDrawer
  | typeof ROUTES.UserDrawer
>;

export type RootStackParamList = Record<RouteName, undefined>;

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), '/'],
  config: {
    initialRouteName: ROUTES.Login,
    screens: {
      [ROUTES.Login]: '',
      [ROUTES.AdminDrawer]: {
        screens: {
          [ROUTES.Dashboard]: 'admin/dashboard',
          [ROUTES.Profile]: 'profile',
          [ROUTES.ItemRegistration]: 'item-registration',
          [ROUTES.PurchaseRequest]: 'purchase-request',
          [ROUTES.UserManagement]: 'user-management',
        },
      },
      [ROUTES.UserDrawer]: {
        screens: {
          [ROUTES.Dashboard]: 'dashboard',
        },
      },
    },
  },
};

export const isLogoutRoute = (route: string) => route === 'Logout';

export const navigateFromSidebar = (
  navigation: NavigationProp<RootStackParamList>,
  route: DrawerRouteName | 'Logout'
) => {
  if (isLogoutRoute(route)) {
    navigation.getParent()?.navigate(ROUTES.Login as never);
    return;
  }
  navigation.navigate(route as never);
};
