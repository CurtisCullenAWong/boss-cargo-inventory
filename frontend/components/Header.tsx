import React from 'react';
import { View, Platform } from 'react-native';
import { 
  Surface, 
  useTheme, 
  IconButton, 
  Text, 
  Avatar, 
  TouchableRipple 
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuPress: () => void;
  onProfilePress?: () => void;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onMenuPress,
  onProfilePress,
  rightAction,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const paddingTop = isWeb ? 12 : insets.top + 10;

  return (
    <Surface
      elevation={2}
      style={{
        backgroundColor: theme.colors.primary,
        paddingTop,
        paddingBottom: 12,
        borderBottomEndRadius: 28,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          minHeight: 64,
        }}
      >

        {/* Left Side */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          {!isWeb && (
            <IconButton
              icon="menu"
              iconColor={theme.colors.onPrimary}
              size={26}
              onPress={onMenuPress}
            />
          )}

          <Text
            variant="titleLarge"
            numberOfLines={1}
            style={{
              color: theme.colors.onPrimary,
              fontWeight: "bold",
              marginLeft: !isWeb ? 4 : 0,
            }}
          >
            {title}
          </Text>
        </View>

        {/* Right Side */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {rightAction && (
            <View style={{ marginRight: 8 }}>{rightAction}</View>
          )}

          <TouchableRipple
            onPress={onProfilePress}
            borderless
            style={{
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            <Avatar.Text
              size={40}
              label="JD"
              style={{
                backgroundColor: theme.colors.primaryContainer,
              }}
              color={theme.colors.onPrimaryContainer}
            />
          </TouchableRipple>
        </View>

      </View>
    </Surface>
  );
};

export default Header;