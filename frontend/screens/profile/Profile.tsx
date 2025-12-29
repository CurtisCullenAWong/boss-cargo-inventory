import { View, ScrollView, Platform } from 'react-native';
import {
  Text,
  Avatar,
  List,
  Divider,
  Button,
  useTheme,
  Surface,
  IconButton,
  Card,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { isLogoutRoute } from 'frontend/navigator/routes';

const ProfileScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { signOut, isLoggingOut } = useAuth();
  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
      }}
    >
      {/* ------------------------------ */}
      {/* Top Bar */}
      {/* ------------------------------ */}
      <Surface
        elevation={1}
        style={{
          height: 56,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
        }}
      >
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text variant="titleMedium" style={{ fontWeight: '600' }}>User Profile</Text>
      </Surface>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 80,
          paddingBottom: 80,
          paddingHorizontal: Platform.OS === 'web' ? 0 : 12,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 640,
            paddingHorizontal: 12,
          }}
        >
          {/* ------------------------------ */}
          {/* User Header */}
          {/* ------------------------------ */}
          <View className="items-center py-6">
            <Avatar.Text
              size={88}
              label="JD"
              style={{ backgroundColor: theme.colors.primaryContainer }}
              color={theme.colors.onPrimaryContainer}
            />

            <Text
              variant="headlineSmall"
              style={{ marginTop: 12, fontWeight: '700' }}
            >
              Juan Dela Cruz
            </Text>

            <Text
              variant="bodyMedium"
              style={{
                marginTop: 2,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              juan.delacruz@company.com
            </Text>

            <Text
              variant="bodySmall"
              style={{
                marginTop: 6,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              Employee ID: **A-10482**
            </Text>
          </View>

          <Divider />

          {/* ------------------------------ */}
          {/* User Details Card */}
          {/* ------------------------------ */}
          <Card mode="contained" style={{ marginTop: 16 }}>
            <Card.Content>
              <Text variant="titleSmall" style={{ marginBottom: 12, opacity: 0.7 }}>
                Employee Information
              </Text>

              <List.Item
                title="Position"
                description="Asset Manager"
                left={(p) => <List.Icon {...p} icon="briefcase-outline" />}
              />

              <List.Item
                title="Department"
                description="Operations — Inventory"
                left={(p) => <List.Icon {...p} icon="office-building" />}
              />

              <List.Item
                title="Assigned Assets"
                description="12 total"
                left={(p) => <List.Icon {...p} icon="archive" />}
                right={(p) => <List.Icon {...p} icon="chevron-right" />}
                // onPress={() => navigation.navigate('AssignedAssetsScreen')}
              />
            </Card.Content>
          </Card>

          <Divider style={{ marginTop: 24 }} />

          {/* ------------------------------ */}
          {/* Security */}
          {/* ------------------------------ */}
          <List.Section style={{ paddingHorizontal: 0 }}>
            <List.Subheader>Security</List.Subheader>
            <List.Item
              title="Edit Profile"
              left={(props) => <List.Icon {...props} icon="account-outline" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />

            <List.Item
              title="Change Password"
              left={(props) => <List.Icon {...props} icon="lock-outline" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </List.Section>

          {/* ------------------------------ */}
          {/* Logout */}
          {/* ------------------------------ */}
          <View style={{ marginTop: 30 }}>
            <Button
              mode="outlined"
              icon={isLoggingOut ? undefined : "logout"}
              textColor={theme.colors.error}
              style={{ borderColor: theme.colors.error, paddingVertical: 4 }}
              loading={isLoggingOut}
              disabled={isLoggingOut}
              onPress={() => {
                if (isLogoutRoute('Logout')) {
                  void signOut();
                }
              }}
            >
              Log Out
            </Button>

            <Text
              variant="labelSmall"
              style={{ textAlign: 'center', marginTop: 12, opacity: 0.5 }}
            >
              {process.env.EXPO_PUBLIC_APP_NAME} ({process.env.EXPO_PUBLIC_SHORT_APP_NAME}, {process.env.EXPO_PUBLIC_APP_ABBREVIATION}) v{process.env.EXPO_PUBLIC_VERSION} - All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
