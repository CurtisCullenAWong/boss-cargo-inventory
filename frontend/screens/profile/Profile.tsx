import React, { useState } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { 
  Text, 
  Avatar, 
  List, 
  Divider, 
  Switch, 
  Button, 
  useTheme, 
  Surface,
  IconButton,
  Chip
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Mock state for toggles
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View 
      className="flex-1" 
      style={{ 
        backgroundColor: theme.colors.background,
        paddingTop: insets.top 
      }}
    >
      {/* 1. Simple Top Bar with Back Button */}
      <View className="flex-row items-center px-2 h-14">
        <IconButton 
          icon="arrow-left" 
          size={24} 
          onPress={() => navigation.goBack()} 
        />
        <Text variant="titleMedium" className="font-bold ml-2">Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* 2. User Info Card */}
        <View className="items-center py-6 px-4">
          <View className="relative">
            <Avatar.Text 
              size={80} 
              label="JD" 
              style={{ backgroundColor: theme.colors.primaryContainer }}
              color={theme.colors.onPrimaryContainer}
            />
            {/* Edit Icon Badge */}
            <Surface 
              elevation={2}
              className="absolute bottom-0 right-0 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <IconButton 
                icon="pencil" 
                size={14} 
                iconColor={theme.colors.onPrimary}
                className="m-0"
                onPress={() => console.log('Edit Profile')}
              />
            </Surface>
          </View>

          <Text variant="headlineSmall" className="mt-4 font-bold">
            Juan Dela Cruz
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            juan.delacruz@email.com
          </Text>

          {/* Verification Badge (Common in Banking Apps) */}
          <View className="flex-row mt-3">
             <Chip 
               icon="check-decagram" 
               mode="flat" 
               textStyle={{ fontSize: 12 }}
               style={{ backgroundColor: theme.colors.secondaryContainer }}
             >
               Fully Verified
             </Chip>
          </View>
        </View>

        <Divider className="my-2" />

        {/* 3. Settings Groups */}
        <List.Section>
          <List.Subheader>Account Settings</List.Subheader>
          
          <List.Item
            title="Personal Information"
            description="Name, birthdate, mobile number"
            left={props => <List.Icon {...props} icon="account-details" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Saved Cards & Accounts"
            left={props => <List.Icon {...props} icon="credit-card-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>App Preferences</List.Subheader>
          
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch 
                value={isDarkTheme} 
                onValueChange={() => setIsDarkTheme(!isDarkTheme)} 
              />
            )}
          />
          <List.Item
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={() => (
              <Switch 
                value={notifications} 
                onValueChange={() => setNotifications(!notifications)} 
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Security</List.Subheader>
          <List.Item
            title="Biometrics Login"
            left={props => <List.Icon {...props} icon="fingerprint" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
           <List.Item
            title="Change PIN"
            left={props => <List.Icon {...props} icon="lock-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        {/* 4. Logout Action */}
        <View className="px-4 mt-6">
          <Button 
            mode="outlined" 
            textColor={theme.colors.error}
            style={{ borderColor: theme.colors.error }}
            icon="logout"
            onPress={() => console.log('Logging out...')}
          >
            Log Out
          </Button>
          
          <Text 
            variant="labelSmall" 
            className="text-center mt-4 opacity-50"
          >
            App Version 1.0.4
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

export default ProfileScreen;