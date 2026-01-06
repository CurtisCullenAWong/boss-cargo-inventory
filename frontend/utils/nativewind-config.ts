/**
 * NativeWind configuration for third-party components
 * This file configures React Native Paper and other third-party components
 * to work with NativeWind's className prop on both mobile and web platforms.
 */

import { cssInterop } from 'nativewind';
import { Image } from 'react-native';
import {
  Surface,
  TouchableRipple,
  Button,
  TextInput,
  Card,
  FAB,
  Chip,
  Divider,
  List,
  Portal,
  Snackbar,
  Text,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';

// Configure React Native Paper components to work with NativeWind className
// This enables className prop to work on web and mobile
// Note: className will be converted to style prop automatically
// Using 'as any' to bypass TypeScript strict checking - the runtime handles this correctly
cssInterop(ActivityIndicator as any, { className: 'style' });
cssInterop(Chip as any, { className: 'style' });
cssInterop(Divider as any, { className: 'style' });
cssInterop(Text as any, { className: 'style' });
cssInterop(Surface as any, { className: 'style' });
cssInterop(TouchableRipple as any, { className: 'style' });
cssInterop(Button as any, { className: 'style' });
cssInterop(TextInput as any, { className: 'style' });
cssInterop(Card as any, { className: 'style' });
cssInterop(IconButton as any, { className: 'style' });
cssInterop(FAB as any, { className: 'style' });
cssInterop(Snackbar as any, { className: 'style' });
cssInterop(List.Item as any, { className: 'style' });
cssInterop(Image as any, { className: 'style' });
cssInterop(Portal as any, { className: 'style' });

// Note: For Animated.View from react-native-reanimated, use style prop instead of className
// on web, or wrap it with a regular View that has className support.
// Example:
// <View className="flex-1">
//   <Animated.View style={animatedStyle}>
//     ...
//   </Animated.View>
// </View>

