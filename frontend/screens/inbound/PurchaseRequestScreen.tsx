import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AppLayout from '../../components/Layout';
import { ROUTES, navigateFromSidebar, type RootStackParamList } from '../../navigator/routes';

type NavigationProp = DrawerNavigationProp<RootStackParamList, typeof ROUTES.PurchaseRequest>;

const PurchaseRequestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentRouteName = ROUTES.PurchaseRequest;

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
          Scan Item 📱
        </Text>
        <Text variant="bodyLarge" className="mb-4">
          Use this screen to scan barcodes or QR codes for inventory items.
        </Text>
        <Button mode="contained" icon="barcode-scan" onPress={() => console.log('Scan pressed')}>
          Start Scanning
        </Button>
      </View>
    </AppLayout>
  );
};

export default PurchaseRequestScreen;
