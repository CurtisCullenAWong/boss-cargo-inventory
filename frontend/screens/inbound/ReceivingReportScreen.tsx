import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import AppLayout from '../../components/Layout';
import { ROUTES, navigateFromSidebar, type RootStackParamList } from '../../navigator/routes';

type NavigationProp = DrawerNavigationProp<RootStackParamList, typeof ROUTES.ReceivingReport>;

const ReceivingReportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentRouteName = ROUTES.ReceivingReport;

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
          Receiving Report
        </Text>
        <Text variant="bodyLarge">
          Placeholder screen for the Receiving Report module.
        </Text>
      </View>
    </AppLayout>
  );
};

export default ReceivingReportScreen;

