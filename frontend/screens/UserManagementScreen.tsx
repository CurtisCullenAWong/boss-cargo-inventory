import React from 'react';
import { View } from 'react-native';
import { Text, Card, List, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AppLayout from '../components/Layout';
import { ROUTES, navigateFromSidebar, type RootStackParamList } from '../navigator/routes';

type NavigationProp = DrawerNavigationProp<RootStackParamList, typeof ROUTES.UserManagement>;

const UserManagementScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentRouteName = ROUTES.UserManagement;

  const handleSidebarNavigation = (route: string) => {
    navigateFromSidebar(navigation, route as any);
  };

  return (
    <AppLayout
      activeRoute={currentRouteName}
      onProfilePress={() => navigation.navigate(ROUTES.Profile)}
      onNavigate={handleSidebarNavigation}
    >
      <View className="gap-4">
        <Text variant="headlineLarge" className="text-3xl font-bold mb-4">
          Users 👥
        </Text>
        <Card className="p-4 mb-4">
          <Text variant="titleMedium" className="mb-2">Total Users</Text>
          <Text variant="headlineMedium" className="font-bold">0</Text>
        </Card>
        <Card className="p-4">
          <Text variant="bodyMedium" className="mb-4">
            User management and administration will be displayed here.
          </Text>
          <List.Item
            title="Sample User"
            description="user@example.com"
            left={props => (
              <Avatar.Text {...props} size={40} label="SU" />
            )}
          />
        </Card>
      </View>
    </AppLayout>
  );
};

export default UserManagementScreen;
