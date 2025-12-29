import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AppLayout from '../components/Layout';
import { ROUTES, navigateFromSidebar, type RootStackParamList } from '../navigator/routes';

type NavigationProp = DrawerNavigationProp<RootStackParamList, typeof ROUTES.Dashboard>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentRouteName = ROUTES.Dashboard;

  const handleSidebarNavigation = (route: string) => {
    navigateFromSidebar(navigation, route as any);
  };

  return (
    <AppLayout
      activeRoute={currentRouteName}
      onProfilePress={() => navigation.navigate(ROUTES.Profile)}
      onNavigate={handleSidebarNavigation}
    >
      <Text variant="headlineLarge" className="text-3xl font-bold mb-4">
        Welcome to the Dashboard! 👋
      </Text>
      <Text variant="bodyLarge" className="mb-4">
        This is the main content area, now dynamically injected into the layout.
      </Text>
      <Text variant="bodyMedium" className="opacity-70">
        Navigate using the sidebar to explore all available screens:
        Dashboard, Scan, Reports, Inventory, Orders, Users, and Profile.
      </Text>
    </AppLayout>
  );
};

export default DashboardScreen;