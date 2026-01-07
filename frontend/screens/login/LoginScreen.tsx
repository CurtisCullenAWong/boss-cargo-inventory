import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { TextInput, Button, Text, Checkbox, Surface, useTheme, MD3Theme } from 'react-native-paper';
import { ROUTES } from '../../navigator/routes';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import useSnackbar from '../../../backend/hooks/useSnackbar';
import { supabase } from '../../../backend/lib/supabaseClient';
import { BlurView } from 'expo-blur';

type Props = NativeStackScreenProps<{ Login: undefined; 'Admin Dashboard': undefined; }, 'Login'>;

const { width } = Dimensions.get('window');
const isMobile = width < 600;

// --- RANDOMIZED DYNAMIC BLOB ---
const Blob = ({ color, maxSize }: { color: string; maxSize: number }) => {
  const initialX = (Math.random() - 0.5) * (maxSize * 0.4);
  const initialY = (Math.random() - 0.5) * (maxSize * 0.4);
  const deltaX = (Math.random() * 0.4 + 0.15) * maxSize;
  const deltaY = (Math.random() * 0.4 + 0.15) * maxSize;
  const duration = Platform.OS === 'web' ? 9000 + Math.random() * 6000 : 11000 + Math.random() * 6000;

  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    translateX.value = withRepeat(withTiming(initialX + deltaX, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
    translateY.value = withRepeat(withTiming(initialY + deltaY, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
    scale.value = withRepeat(withTiming(1 + Math.random() * 0.2, { duration: duration * 1.1, easing: Easing.inOut(Easing.sin) }), -1, true);
    rotate.value = withRepeat(withTiming(20 + Math.random() * 40, { duration: duration * 2, easing: Easing.linear }), -1, false);
    opacity.value = withRepeat(withTiming(0.25 + Math.random() * 0.15, { duration: duration * 1.4, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className="absolute"
      style={[
        {
          width: maxSize,
          height: maxSize,
          borderRadius: maxSize / 2,
          backgroundColor: color,
          left: '50%',
          top: '50%',
          marginLeft: -maxSize / 2,
          marginTop: -maxSize / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

// --- RANDOMIZED MESH BACKGROUND ---
const MeshBackground = ({ theme }: { theme: MD3Theme }) => {
  const isDark = theme.dark;
  const blobColors = [theme.colors.primaryContainer, theme.colors.secondaryContainer, theme.colors.tertiaryContainer, theme.colors.primary];
  const blobCount = Platform.OS === 'web' ? 8 : 6;

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0">
      <View className="absolute top-0 left-0 right-0 bottom-0">
        {Array.from({ length: blobCount }).map((_, i) => (
          <Blob
            key={i}
            color={blobColors[i % blobColors.length]}
            maxSize={width * (isMobile ? (0.6 + Math.random() * 0.3) : (0.9 + Math.random() * 0.5))}
          />
        ))}
      </View>
      <BlurView intensity={70} tint={isDark ? 'dark' : 'light'} className="absolute top-0 left-0 right-0 bottom-0" />
      <View
        pointerEvents="none"
        className="absolute top-0 left-0 right-0 bottom-0"
        style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)' }}
      />
    </View>
  );
};

// --- HEADER ---
const LoginHeader: React.FC = () => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(800).springify()}
      className={`items-center ${isMobile ? 'mb-4' : 'mb-10'}`}
    >
      <View className="flex-col items-center justify-center px-4 mb-4">
        <View className="flex-row items-baseline justify-center flex-wrap">
          <Text variant="displayLarge" style={{ color: theme.colors.onSurface }}>
            {process.env.EXPO_PUBLIC_SHORT_APP_NAME}
          </Text>
          <Text variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
            {process.env.EXPO_PUBLIC_APP_ABBREVIATION}
          </Text>
        </View>
        <Text variant="bodyLarge" className="text-center" style={{ color: theme.colors.onSurface }}>
          {process.env.EXPO_PUBLIC_APP_NAME}
        </Text>
      </View>
    </Animated.View>
  );
};

// --- FORM ---
interface LoginFormProps {
  isLoading: boolean;
  onSubmit: (email: string, pass: string) => void;
}

const LoginForm = ({ isLoading, onSubmit }: LoginFormProps) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { colors, dark } = theme;
  const inputBackgroundColor = dark
    ? colors.elevation?.level3 ?? colors.surfaceVariant ?? colors.surface
    : colors.surfaceVariant ?? colors.surface;

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(800).springify()}
      // Uses 95% width on mobile, capped at 480px for larger screens
      className="w-full items-center px-4"
    >
      <Surface
        elevation={dark ? 2 : 4}
        className="w-full rounded-[28px]"
        style={{
          maxWidth: 480, // Optimized for both mobile and web clarity
          paddingHorizontal: isMobile ? 20 : 32,
          paddingVertical: isMobile ? 32 : 40,
          backgroundColor: colors.surface,
        }}
      >
        <View className={`items-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
          <Text variant="headlineSmall" className="text-center font-bold" style={{ color: colors.onSurface }}>
            Welcome Back
          </Text>
          <Text variant="bodyMedium" className="text-center mt-1" style={{ color: colors.onSurfaceVariant }}>
            Please sign in to continue
          </Text>
        </View>

        <View className="gap-y-4">
          <TextInput
            mode="outlined"
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="admin@vista.com"
            keyboardType="email-address"
            autoCapitalize="none"
            outlineColor="transparent"
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="email-outline" color={colors.onSurfaceVariant} />}
            className="h-14 rounded-xl"
            style={{ backgroundColor: inputBackgroundColor }}
          />
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            outlineColor="transparent"
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="lock-outline" color={colors.onSurfaceVariant} />}
            right={<TextInput.Icon icon={isPasswordVisible ? 'eye-off' : 'eye'} onPress={() => setIsPasswordVisible((v) => !v)} color={colors.onSurfaceVariant} />}
            className="h-14 rounded-xl"
            style={{ backgroundColor: inputBackgroundColor }}
          />

          <View className="flex-row items-center justify-between mt-1">
            <TouchableOpacity 
              onPress={() => setRememberMe((v) => !v)} 
              className="flex-row items-center"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Checkbox status={rememberMe ? 'checked' : 'unchecked'} color={colors.primary} />
              <Text style={{ color: colors.onSurface }}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text className="text-[13px] font-medium" style={{ color: colors.primary }}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => onSubmit(email, password)}
          loading={isLoading}
          disabled={isLoading}
          className="mt-4 self-center w-4/5 rounded"
          contentStyle={{ height: 56, justifyContent: 'center' }}
        >
          Login
        </Button>
        <View className="flex-row justify-center mt-6 flex-wrap">
          <Text style={{ color: colors.onSurfaceVariant }}>New to {process.env.EXPO_PUBLIC_SHORT_APP_NAME}?</Text>
          <TouchableOpacity>
            <Text className="ml-1 font-bold" style={{ color: colors.primary }}>Request Access</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    </Animated.View>
  );
};

// --- MAIN SCREEN ---
const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { showSnackbar, SnackbarElement } = useSnackbar();

  const handleLogin = async (email: string, pass: string) => {
    if (!email || !pass) {
      showSnackbar('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) {
        showSnackbar(error.message || 'Unable to sign in. Please try again.');
        return;
      }
      navigation.navigate(ROUTES.AdminDrawer as never);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      {SnackbarElement}
      <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
        <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
        <MeshBackground theme={theme} />

        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: isMobile ? 'flex-start' : 'center',
              alignItems: 'center',
              paddingHorizontal: isMobile ? 16 : 24,
              paddingTop: isMobile ? '25%' : '1%',
              paddingBottom: isMobile ? 20 : 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <LoginHeader />
            <LoginForm isLoading={isLoading} onSubmit={handleLogin} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </GestureHandlerRootView>
  );
};

export default LoginScreen;