import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions,
  StyleSheet
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  useTheme,
  MD3Theme,
} from 'react-native-paper';
import { ROUTES } from '../../navigator/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
  FadeInDown,
  FadeInUp
} from 'react-native-reanimated';

// --- TYPES ---
type RootStackParamList = {
  Login: undefined;
  AdminDrawer: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const { width } = Dimensions.get('window');

// --- RANDOMIZED DYNAMIC BLOB ---
const Blob = ({ color, maxSize }: { color: string; maxSize: number }) => {
  // Random initial position
  const initialX = Math.random() * maxSize - maxSize / 2;
  const initialY = Math.random() * maxSize - maxSize / 2;

  // Random movement delta — bigger for web
  const deltaX = (Math.random() * 1.5 + 0.5) * maxSize; // 50% – 200% of size
  const deltaY = (Math.random() * 1.5 + 0.5) * maxSize;

  // Random animation duration — faster for web
  const duration = 6000 + Math.random() * 6000; // 6–12s

  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(initialX + deltaX, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(initialY + deltaY, { duration: duration * 0.9, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1 + Math.random() * 0.7, { duration: duration * 1.1, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    rotate.value = withRepeat(
      withTiming(Math.random() * 360, { duration: duration * 1.5, easing: Easing.linear }),
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
          opacity: 0.4 + Math.random() * 0.4, // 0.4–0.8
          left: 0,
          top: 0,
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
    theme.colors.secondary,
    theme.colors.tertiary
  ];

  // More blobs on web
  const blobCount = Platform.OS === 'web' ? 12 : blobColors.length;

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {Array.from({ length: blobCount }).map((_, i) => {
          const color = blobColors[i % blobColors.length];
          return <Blob key={i} color={color} maxSize={width * (1.2 + Math.random() * 0.8)} />;
        })}
        <View
          style={
            Platform.OS === 'web'
              ? { ...StyleSheet.absoluteFillObject, backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.15)' }
              : {}
          }
        />
      </View>
    </View>
  );
};

// --- HEADER ---
const LoginHeader = ({ theme }: { theme: MD3Theme }) => (
  <Animated.View
    entering={FadeInDown.delay(100).duration(800).springify()}
    className="items-center mb-10"
  >
    <Surface
      elevation={2}
      style={{
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
        backgroundColor: theme.colors.primary,
      }}
    >
      {/* Icon changed to reflect 'Vista' (View/Dashboard) or Inventory */}
      <MaterialCommunityIcons name="view-dashboard-outline" size={44} color={theme.colors.onPrimary} />
    </Surface>
    
      <View className="flex-col items-center justify-center px-4">
        <View 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'baseline',
            justifyContent: 'center',
          }}
        >
          <Text 
            variant="displayLarge" 
            style={{ 
              fontWeight: '300', 
              color: theme.colors.onSurface, 
            }}
          >
            {process.env.EXPO_PUBLIC_SHORT_APP_NAME}
          </Text>
          <Text 
            variant="headlineSmall" 
            style={{ 
              color: theme.colors.onBackground, 
              letterSpacing: 1
            }}
          >
            {process.env.EXPO_PUBLIC_APP_ABBREVIATION}
          </Text>
        </View>

        <Text 
          variant="labelLarge" 
          style={{ 
            marginTop: 8,
            marginBottom: 4, 
            color: theme.colors.onSurface, 
            fontWeight: '700',
            textAlign: 'center',
            opacity: 0.9
          }}
        >
          Asset Inventory Management System
        </Text>
        
        <Text 
          variant="bodyMedium" 
          style={{ 
            color: theme.colors.onSurfaceVariant, 
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          Sign in to manage your inventory
        </Text>
      </View>

  </Animated.View>
);

// --- FORM ---
const LoginForm = ({ theme, isLoading, onSubmit }: { theme: MD3Theme; isLoading: boolean; onSubmit: () => void; }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Light mode specific input background style
  const inputBackgroundColor = theme.dark 
    ? theme.colors.elevation.level3 
    : theme.colors.surfaceVariant; // Uses a cleaner grey in light mode

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(800).springify()}
      className="w-full max-w-[400px]"
    >
      <Surface
        elevation={theme.dark ? 2 : 4} // Slightly higher elevation in light mode for separation
        style={{
          borderRadius: 28,
          backgroundColor: theme.colors.surface, // Pure surface color
          paddingHorizontal: 24,
          paddingVertical: 32,
          marginHorizontal: 8,
          borderWidth: 1,
          borderColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
        }}
      >
        <View className="gap-y-5">
          <TextInput
            mode="outlined"
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="admin@vista.com"
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            keyboardType="email-address"
            autoCapitalize="none"
            outlineColor="transparent"
            activeOutlineColor={theme.colors.primary}
            style={{ 
              backgroundColor: inputBackgroundColor,
              borderRadius: 12,
              height: 56,
              opacity: theme.dark ? 1 : 0.7 // Subtle transparency in light mode
            }}
            contentStyle={{ paddingHorizontal: 4 }}
            left={<TextInput.Icon icon="email-outline" color={theme.colors.onSurfaceVariant} />}
          />

          <View>
            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              outlineColor="transparent"
              activeOutlineColor={theme.colors.primary}
              style={{ 
                backgroundColor: inputBackgroundColor,
                borderRadius: 12,
                height: 56,
                opacity: theme.dark ? 1 : 0.7
              }}
              contentStyle={{ paddingHorizontal: 4 }}
              left={<TextInput.Icon icon="lock-outline" color={theme.colors.onSurfaceVariant} />}
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? "eye-off" : "eye"}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  color={theme.colors.onSurfaceVariant}
                />
              }
            />
            <TouchableOpacity 
              className="self-end mt-3 mb-1" 
              onPress={() => console.log("Forgot?")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isLoading}
            contentStyle={{ height: 56 }}
            style={{ borderRadius: 12, marginTop: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: "700", letterSpacing: 0.5 }}
          >
            Access Dashboard
          </Button>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, alignItems: 'center' }}>
          <Text 
            variant="bodyMedium" 
            style={{ 
              color: theme.colors.onSurfaceVariant,
            }}
          >
            New to Vista?
          </Text>
          <TouchableOpacity 
            onPress={() => console.log("Request Access")}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text
              variant="bodyMedium"
              style={{
                marginLeft: 4,
                fontWeight: 'bold',
                color: theme.colors.onSurface,
              }}
            >
              Request Access
            </Text>
          </TouchableOpacity>
        </View>
      </Surface>
    </Animated.View>
  );
};

// --- MAIN SCREEN ---
const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate(ROUTES.AdminDrawer as any);
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar 
        barStyle={theme.dark ? "light-content" : "dark-content"} 
        translucent 
        backgroundColor="transparent" 
      />

      {/* 1. Background Layer */}
      <MeshBackground theme={theme} />

      {/* 2. Content Layer */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" 
          keyboardDismissMode="on-drag"
        >
          <View className="items-center px-6">
            <LoginHeader theme={theme} />
            <LoginForm theme={theme} isLoading={isLoading} onSubmit={handleLogin} />
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;