import { View, Platform } from 'react-native';
import { 
  Surface, 
  useTheme, 
  IconButton, 
  Text, 
  Avatar, 
  TouchableRipple 
} from 'react-native-paper';

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
}) => {
  const theme = useTheme();
  const isWeb = Platform.OS === "web";

  return (
    <Surface
    className='elevation rounded-br-3xl'
      style={{
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 24,
      }}
    >
      <View
      className='flex-row items-center px-2.5 p-3'
      >

        {/* Left Side */}
        <View className='flex-row items-center flex-1'>
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
            style={{
              color: theme.colors.onPrimary,
              marginLeft: !isWeb ? 4 : 0,
            }}
          >
            {title}
          </Text>
        </View>

        {/* Right Side */}
        <View className='flex-row items-center'>
          <TouchableRipple
            onPress={onProfilePress}
            className='rounded-full'
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