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
  // Center movement range
  const initialX = (Math.random() - 0.5) * (maxSize * 0.4);
  const initialY = (Math.random() - 0.5) * (maxSize * 0.4);

  // Much calmer drift
  const deltaX = (Math.random() * 0.4 + 0.15) * maxSize; 
  const deltaY = (Math.random() * 0.4 + 0.15) * maxSize;

  const duration = Platform.OS === "web"
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
          position: "absolute",
          width: maxSize,
          height: maxSize,
          borderRadius: maxSize / 2,
          backgroundColor: color,
          left: "50%",
          top: "50%",
          marginLeft: -maxSize / 2,
          marginTop: -maxSize / 2,
        },
        animatedStyle,
      ]}
    />
  );
};


// --- RANDOMIZED MESH BACKGROUND (Updated) ---
const MeshBackground = ({ theme }: { theme: MD3Theme }) => {
  const isDark = theme.dark;

  const blobColors = [
    theme.colors.primaryContainer,
    theme.colors.secondaryContainer,
    theme.colors.tertiaryContainer,
    theme.colors.primary,
  ];

  // Fewer blobs for cleaner focus, but still enough for movement
  const blobCount = Platform.OS === "web" ? 8 : 6;

  return (
    <View className='absolute inset-0'>
      <View className='absolute inset-0'>
        {Array.from({ length: blobCount }).map((_, i) => (
          <Blob
            key={i}
            color={blobColors[i % blobColors.length]}
            maxSize={width * (0.9 + Math.random() * 0.5)}
          />
        ))}
      </View>

      {/* Blur ABOVE blobs */}
      <BlurView
        intensity={70}
        tint={isDark ? 'dark' : 'light'}
        className='absolute inset-0'
      />

      {/* Soft overlay */}
      <View
        pointerEvents="none"
        className={`absolute inset-0 ${isDark ? "bg-black/30" : "bg-white/20"}`}
      />
      </View>
  );
};


// --- HEADER ---
const LoginHeader = ({ theme }: { theme: MD3Theme }) => (
  <Animated.View
    entering={FadeInDown.delay(100).duration(800).springify()}
    className="items-center mb-10"
  >
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