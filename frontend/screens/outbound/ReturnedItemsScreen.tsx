import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import AppLayout from '../../components/Layout';
import { ROUTES, navigateFromSidebar, type RootStackParamList } from '../../navigator/routes';

type NavigationProp = DrawerNavigationProp<RootStackParamList, typeof ROUTES.ReturnedItems>;

const ReturnedItemsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentRouteName = ROUTES.ReturnedItems;

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
          Returned Items
        </Text>
        <Text variant="bodyLarge">
          Placeholder screen for the Returned Items module.
        </Text>
      </View>
    </AppLayout>
  );
};

export default ReturnedItemsScreen;

