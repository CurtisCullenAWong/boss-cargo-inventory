import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import useSnackbar from '../../hooks/useSnackbar';
import { supabase } from '../../../backend/lib/supabaseClient';
import { ScrollView } from 'react-native-gesture-handler';

// --- TYPES ---
type Props = NativeStackScreenProps<
  {
    Login: undefined;
    'Admin Dashboard': undefined;
  },
  'Login'
>;

const { width, height } = Dimensions.get('window');
const isMobile = width < 600;

// --- RANDOMIZED DYNAMIC BLOB ---
const Blob = ({ color, maxSize }: { color: string; maxSize: number }) => {
  const initialX = (Math.random() - 0.5) * (maxSize * 0.4);
  const initialY = (Math.random() - 0.5) * (maxSize * 0.4);
  const deltaX = (Math.random() * 0.4 + 0.15) * maxSize;
  const deltaY = (Math.random() * 0.4 + 0.15) * maxSize;
  const duration =
    Platform.OS === 'web'
      ? 9000 + Math.random() * 6000
      : 11000 + Math.random() * 6000;

  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(initialX + deltaX, {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(initialY + deltaY, {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1 + Math.random() * 0.2, {
        duration: duration * 1.1,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
    rotate.value = withRepeat(
      withTiming(20 + Math.random() * 40, {
        duration: duration * 2,
        easing: Easing.linear,
      }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withTiming(0.25 + Math.random() * 0.15, {
        duration: duration * 1.4,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
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
  const blobColors = [
    theme.colors.primaryContainer,
    theme.colors.secondaryContainer,
    theme.colors.tertiaryContainer,
    theme.colors.primary,
  ];
  const blobCount = Platform.OS === 'web' ? 8 : 6;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {Array.from({ length: blobCount }).map((_, i) => (
          <Blob
            key={i}
            color={blobColors[i % blobColors.length]}
            maxSize={width * (isMobile ? (0.6 + Math.random() * 0.3) : (0.9 + Math.random() * 0.5))}
          />
        ))}
      </View>
      {/* <BlurView
        intensity={70}
        tint={isDark ? 'dark' : 'light'}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      /> */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)',
        }}
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
      style={{ alignItems: 'center', marginBottom: isMobile ? 16 : 40 }}
    >
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Text
            variant="displayLarge"
            style={{
              color: theme.colors.onSurface,
            }}
          >
            {process.env.EXPO_PUBLIC_SHORT_APP_NAME}
          </Text>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onBackground }}
          >
            {process.env.EXPO_PUBLIC_APP_ABBREVIATION}
          </Text>
        </View>
        <Text
          variant="bodyLarge"
          style={{
            color: theme.colors.onSurface,
            textAlign: 'center',
          }}
        >
          {process.env.EXPO_PUBLIC_APP_NAME}
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            marginTop: isMobile ? 2 : 4,
          }}
        >
          Sign in to manage your inventory
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
  const isSmallScreen = isMobile;

  const { colors, dark } = theme;
  const primaryColor = colors.primary;
  const surfaceColor = colors.surface;
  const onSurfaceColor = colors.onSurface;
  const onSurfaceVariant = colors.onSurfaceVariant;
  const inputBackgroundColor =
    dark
      ? colors.elevation?.level3 ?? colors.surfaceVariant ?? colors.surface
      : colors.surfaceVariant ?? colors.surface;

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(800).springify()}
      style={{
        width: isSmallScreen ? '100%' : 400,
        alignItems: 'center',
      }}
    >
      <Surface
        elevation={dark ? 2 : 4}
        style={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 28,
          paddingHorizontal: isSmallScreen ? 16 : 24,
          paddingVertical: isSmallScreen ? 24 : 32,
          backgroundColor: surfaceColor,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: isSmallScreen ? 16 : 32, alignItems: 'center' }}>
          <Text variant="headlineSmall" style={{ color: onSurfaceColor, textAlign: 'center' }}>
            Welcome Back
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: onSurfaceVariant, textAlign: 'center', marginTop: 4 }}
          >
            Please sign in to continue
          </Text>
        </View>

        {/* Inputs */}
        <View style={{ gap: 12 }}>
          <TextInput
            mode="outlined"
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="admin@vista.com"
            keyboardType="email-address"
            autoCapitalize="none"
            outlineColor="transparent"
            activeOutlineColor={primaryColor}
            left={<TextInput.Icon icon="email-outline" color={onSurfaceVariant} disabled/>}
            style={{
              backgroundColor: inputBackgroundColor,
              borderRadius: 12,
              height: 56,
            }}
            contentStyle={{ paddingHorizontal: 4 }}
          />
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            outlineColor="transparent"
            activeOutlineColor={primaryColor}
            left={<TextInput.Icon icon="lock-outline" color={onSurfaceVariant} disabled/>}
            right={
              <TextInput.Icon
                icon={isPasswordVisible ? 'eye-off' : 'eye'}
                onPress={() => setIsPasswordVisible((v) => !v)}
                color={onSurfaceVariant}
              />
            }
            style={{
              backgroundColor: inputBackgroundColor,
              borderRadius: 12,
              height: 56,
            }}
            contentStyle={{ paddingHorizontal: 4 }}
          />
        {/* Remember Me */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => setRememberMe((v) => !v)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe((v) => !v)}
              color={primaryColor}
            />
            <Text style={{ color: onSurfaceColor }}>
              Remember me
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={{ color: onSurfaceColor, fontSize: 12 }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        </View>

        {/* Button */}
        <Button
          mode="contained"
          onPress={() => onSubmit(email, password)}
          loading={isLoading}
          disabled={isLoading}
          style={{
            marginTop: 24,
            borderRadius: 12,
            height: 56,
            justifyContent: 'center',
            alignSelf: 'center',
            width: '80%',
          }}
        >
          Login
        </Button>
        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          <Text style={{ color: onSurfaceVariant }}>New to {process.env.EXPO_PUBLIC_SHORT_APP_NAME}?</Text>
          <TouchableOpacity>
            <Text style={{ marginLeft: 4, color: onSurfaceColor }}>Request Access</Text>
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        showSnackbar(error.message || 'Unable to sign in. Please try again.');
        return;
      }

      // Successful sign-in: Supabase auth listener in AuthProvider will update the session
      // and the navigator will automatically switch to the protected drawer.
      navigation.navigate(ROUTES.AdminDrawer as never);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    {SnackbarElement}
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />

      {/* Background Blobs */}
      <MeshBackground theme={theme} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
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
          {/* Header */}
          <LoginHeader />

          {/* Login Form */}
          <LoginForm isLoading={isLoading} onSubmit={handleLogin} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  </GestureHandlerRootView>
  );
};

export default LoginScreen;