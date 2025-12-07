import React from 'react';
import { View, Platform } from 'react-native';
import { Surface, useTheme, IconButton, Text, Avatar, TouchableRipple } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuPress: () => void;
  onProfilePress?: () => void; // New prop for profile navigation
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onMenuPress,
  onProfilePress,
  rightAction
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const paddingTop = isWeb ? 16 : insets.top + 12;

  return (
    <Surface
      elevation={2}
      className="rounded-b-3xl z-10"
      style={{
        backgroundColor: theme.colors.elevation.level1,
        paddingTop,
      }}
    >
      <View className="flex-row justify-between items-center px-4 pb-4 min-h-[56px]">
        
        {/* Left Side: Menu + Title */}
        <View className="flex-row items-center flex-1 gap-x-2">
          {!isWeb && (
            <IconButton
              icon="menu"
              iconColor={theme.colors.primary}
              size={24}
              onPress={onMenuPress}
              className="m-0"
            />
          )}

          <View className="flex-1 justify-center">
            <Text
              variant="titleLarge"
              numberOfLines={1}
              className="font-bold"
              style={{ color: theme.colors.primary }}
            >
              {title}
            </Text>
          </View>
        </View>

        {/* Right Side: Actions + Profile */}
        <View className="flex-row items-center gap-x-3">
          {/* Optional: Theme switch or other buttons */}
          {rightAction && <View>{rightAction}</View>}

          {/* Profile Avatar - Now Clickable */}
          <TouchableRipple
            onPress={onProfilePress}
            borderless
            style={{ borderRadius: 20 }} // Ensures ripple is circular
          >
            <Avatar.Text 
              size={40} 
              label="JD" 
              style={{ backgroundColor: theme.colors.primaryContainer }} 
              color={theme.colors.onPrimaryContainer}
            />
          </TouchableRipple>
        </View>

      </View>
    </Surface>
  );
};

export default Header;