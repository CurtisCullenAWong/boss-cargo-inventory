/**
 * NativeWind configuration for third-party components
 * This file configures React Native Paper and other third-party components
 * to work with NativeWind's className prop on both mobile and web platforms.
 */

import { cssInterop } from 'nativewind';
import { Image, Animated as RNAnimated } from 'react-native';
import Animated from 'react-native-reanimated';
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
// Configure React Native's Image component to work with NativeWind className
cssInterop(Image, { className: 'style' });
cssInterop(Portal as any, { className: 'style' });

// Configure React Native's built-in Animated components
cssInterop(RNAnimated.View as any, { className: 'style' });
cssInterop(RNAnimated.Text as any, { className: 'style' });
cssInterop(RNAnimated.Image as any, { className: 'style' });
cssInterop(RNAnimated.ScrollView as any, { className: 'style' });