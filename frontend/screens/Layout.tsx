import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
// 1. Remove useNavigation hook import (not needed)
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Sidebar from '../components/sidebar/AdminSidebar'; 
import Header from '../components/Header'; 

type RootStackParamList = {
  Layout: undefined;
  Profile: undefined;
};

// 2. This definition automatically types the 'navigation' prop
type Props = NativeStackScreenProps<RootStackParamList, 'Layout'>;

// 3. Destructure 'navigation' from props here
const LayoutScreen: React.FC<Props> = ({ navigation }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeRoute, setActiveRoute] = useState('Layout');
  // 4. Removed const navigation = useNavigation(); 
  const theme = useTheme();

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
        onNavigate={(route) => setActiveRoute(route)}
      />

      {/* 2. Main Content Column */}
      <View className="flex-1">
        <Header 
          title={activeRoute} 
          onMenuPress={() => setIsSidebarOpen(!isSidebarOpen)}
          onProfilePress={() => navigation.navigate('Profile')}
        />

        <ScrollView 
          className="flex-1"
          contentContainerClassName="px-4 pt-6 pb-10" 
        >
          {/* CONTENT */}
        </ScrollView>
      </View>
    </View>
  );
};

export default LayoutScreen;