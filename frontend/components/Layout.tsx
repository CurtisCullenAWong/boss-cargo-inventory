import { useState, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sidebar from '../components/Sidebar'; 
import Header from '../components/Header';
import { useSidebarContext } from '../context/SidebarContext'; 

/**
 * Props for the AppLayout component.
 * @param children - The content to be rendered inside the main scroll view.
 * @param activeRoute - The name of the currently active route/screen (used for the Header title).
 * @param onProfilePress - Callback function when the profile icon is pressed.
 * @param onNavigate - Callback function to update the active route, usually triggered by the Sidebar.
 */
interface AppLayoutProps {
  children: ReactNode;
  activeRoute: string;
  onProfilePress: () => void;
  onNavigate: (route: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activeRoute, 
  onProfilePress,
  onNavigate,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMinimized, setIsMinimized } = useSidebarContext();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-1 flex-row" 
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* 1. Sidebar Column */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMinimized={isMinimized}
        onMinimizeToggle={setIsMinimized}
        activeRoute={activeRoute}
        onNavigate={onNavigate}
      />

      {/* 2. Main Content Column */}
      <View className="flex-1">
        <Header 
          title={activeRoute} 
          onMenuPress={() => setIsSidebarOpen(!isSidebarOpen)}
          onProfilePress={onProfilePress}
        />
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: Math.max(insets.bottom, 40),
          }}
        >
          {children} 
        </ScrollView>
      </View>
    </View>
  );
};

export default AppLayout;