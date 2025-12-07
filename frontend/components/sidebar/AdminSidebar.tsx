import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { 
  useTheme, 
  IconButton, 
  Text, 
  TouchableRipple, 
  SegmentedButtons 
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme as useAppTheme, type ThemeMode } from '../../context/ThemeContext';

// --- 1. CONFIGURATION ---
const APP_NAME = "Boss Cargo Inventory";

export type SidebarConfigItem = {
  key: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  position: 'top' | 'bottom';
  children?: SidebarConfigItem[];
};

export const SIDEBAR_CONFIG: SidebarConfigItem[] = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'view-dashboard', position: 'top' },
  { key: 'Scan', label: 'Scan Item', icon: 'barcode-scan', position: 'top' },
  { 
    key: 'Reports', label: 'Reports', icon: 'file-chart', position: 'top',
    children: [
      { key: 'Reports/Sales', label: 'Sales Report', icon: 'chart-line', position: 'top' },
      { key: 'Reports/Traffic', label: 'Traffic Stats', icon: 'chart-bar', position: 'top' },
      { key: 'Reports/Performance', label: 'Performance', icon: 'speedometer', position: 'top' },
    ]
  },
  { 
    key: 'Inventory', label: 'Inventory', icon: 'clipboard-list', position: 'top',
    children: [
        { key: 'Inventory/List', label: 'All Items', icon: 'format-list-bulleted', position: 'top' },
        { key: 'Inventory/LowStock', label: 'Low Stock', icon: 'alert-circle-outline', position: 'top' },
    ]
  },
  { key: 'Orders', label: 'Orders', icon: 'cart', position: 'top' }, 
  { key: 'Users', label: 'Users', icon: 'account-group', position: 'top' },
  { key: 'Logout', label: 'Logout', icon: 'logout', position: 'bottom' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimizeToggle?: (minimized: boolean) => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
  footer?: React.ReactNode;
}

// --- 2. MENU ITEMS & GROUPS ---

const SidebarItem = React.memo(({ 
  icon, label, isMinimized, isActive, onPress, isChild, hasChildren, animatedIconStyle, expandAnim 
}: {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  isMinimized?: boolean;
  isActive?: boolean;
  onPress: () => void;
  isChild?: boolean;
  hasChildren?: boolean;
  animatedIconStyle?: any; 
  expandAnim: Animated.Value;
}) => {
  const theme = useTheme();
  
  const bgColor = isActive ? theme.colors.secondaryContainer : 'transparent';
  const textColor = isActive ? theme.colors.onSecondaryContainer : (isChild ? theme.colors.onSurfaceVariant : theme.colors.onSurface);
  
  // Layout logic for minimized vs regular state
  // Note: We keep padding even when minimized, but reduce it, to allow animation interpolation if needed, 
  // but simpler to switch classes. The overflow hidden ensures text doesn't leak during transition.
  const wrapperClasses = isMinimized ? 'items-center px-0' : 'px-3';
  
  let rippleClasses = isMinimized 
    ? 'w-12 justify-center px-0' 
    : 'w-full justify-start pr-4 ';

  if (!isMinimized) {
    rippleClasses += isChild ? 'pl-12' : 'pl-4';
  }

  // Opacity Animation: Fade out text immediately when shrinking (1 -> 0.4), Fade in late when growing (0.4 -> 1)
  const textOpacity = expandAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  });

  return (
    <View className={`mb-1 ${wrapperClasses}`}>
      <TouchableRipple
        onPress={onPress} borderless
        style={{ backgroundColor: bgColor, overflow: 'hidden' }}
        className={`h-12 rounded-full flex-row items-center ${rippleClasses}`}
      >
        <>
          {(icon || !isChild) && (
            <View className={isMinimized ? '' : 'mr-4'}>
              <MaterialCommunityIcons 
                name={icon || 'circle-small'} 
                size={isChild ? 20 : 24} 
                color={isActive ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant} 
              />
            </View>
          )}
          <Animated.View 
            style={{ 
                flex: 1, 
                flexDirection: 'row', 
                alignItems: 'center', 
                opacity: textOpacity,
                display: isMinimized ? 'none' : 'flex' 
            }}
          >
            <Text 
              variant={isChild ? "bodyMedium" : "titleSmall"} 
              numberOfLines={1} 
              className={`flex-1 ${isChild ? 'font-normal opacity-80' : 'font-semibold'}`}
              style={{ color: textColor }}
            >
              {label}
            </Text>
            {hasChildren && (
              <Animated.View style={animatedIconStyle}>
                <MaterialCommunityIcons name="chevron-down" size={20} color={theme.colors.onSurfaceVariant} />
              </Animated.View>
            )}
          </Animated.View>
        </>
      </TouchableRipple>
    </View>
  );
});

const SidebarGroup = ({ item, isMinimized, activeRoute, onNavigate, onMinimizeToggle, onClose, expandAnim }: {
  item: SidebarConfigItem;
  isMinimized: boolean;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onMinimizeToggle?: (val: boolean) => void;
  onClose: () => void;
  expandAnim: Animated.Value;
}) => {
  const [expanded, setExpanded] = useState(false);
  const groupExpandAnim = useRef(new Animated.Value(0)).current; // Animation for the Accordion vertical expansion

  const isChildActive = useMemo(() => item.children?.some(child => child.key === activeRoute), [item.children, activeRoute]);

  useEffect(() => { 
    if (isChildActive) setExpanded(true); 
  }, [isChildActive]);

  useEffect(() => {
    Animated.timing(groupExpandAnim, {
      toValue: expanded ? 1 : 0, duration: 300, useNativeDriver: false, easing: Easing.inOut(Easing.ease),
    }).start();
  }, [expanded]);

  const handlePress = () => {
    if (isMinimized) {
      onMinimizeToggle?.(false);
      setTimeout(() => setExpanded(true), 100);
    } else {
      setExpanded(!expanded);
    }
  };

  const arrowRotation = groupExpandAnim.interpolate({
    inputRange: [0, 1], outputRange: ['0deg', '180deg'],
  });

  const contentHeight = groupExpandAnim.interpolate({
    inputRange: [0, 1], outputRange: [0, (item.children?.length || 0) * 52],
  });

  return (
    <View>
      <SidebarItem
        icon={item.icon} 
        label={item.label} 
        isMinimized={isMinimized}
        isActive={isMinimized && isChildActive} 
        onPress={handlePress}
        hasChildren 
        animatedIconStyle={{ transform: [{ rotate: arrowRotation }] }}
        expandAnim={expandAnim}
      />
      
      {!isMinimized && (
        <Animated.View style={{ height: contentHeight, overflow: 'hidden' }}>
          {item.children?.map(child => (
            <SidebarItem
              key={child.key} 
              label={child.label} 
              icon={child.icon}
              isMinimized={false} 
              isActive={activeRoute === child.key}
              isChild
              expandAnim={expandAnim}
              onPress={() => {
                onNavigate(child.key);
                onClose();
              }}
            />
          ))}
        </Animated.View>
      )}
    </View>
  );
};

// --- 3. THEME SWITCHER ---

const ThemeSwitcher = ({ expandAnim, isMinimized }: { expandAnim: Animated.Value; isMinimized: boolean; }) => {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useAppTheme();
  const isWeb = Platform.OS === 'web';

  const cycleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('auto');
    else setThemeMode('light');
  };

  const getCycleIcon = () => {
    switch (themeMode) {
      case 'light': return 'white-balance-sunny';
      case 'dark': return 'weather-night';
      default: return 'brightness-auto';
    }
  };

  const expandedOpacity = expandAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const collapsedOpacity = expandAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const collapsedScale = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] });

  return (
    <View 
      className="border-t relative p-2"
      style={{ borderColor: theme.colors.outlineVariant, minHeight: 110 }}
    >
      
      {/* EXPANDED STATE */}
      <Animated.View 
        className="absolute w-full p-4 justify-center h-full"
        style={{ opacity: expandedOpacity, zIndex: isMinimized ? 0 : 1 }}
        pointerEvents={isMinimized ? 'none' : 'auto'}
      >
        <Text variant="labelMedium" className="mb-3 opacity-60 font-semibold text-center">Select Theme</Text>
        <SegmentedButtons
          value={themeMode}
          onValueChange={(val) => setThemeMode(val as ThemeMode)}
          density="small"
          buttons={[
            { value: 'light', icon: 'white-balance-sunny', label: isWeb ? undefined : 'Light', showSelectedCheck: true },
            { value: 'dark', icon: 'weather-night', label: isWeb ? undefined : 'Dark', showSelectedCheck: true },
            { value: 'auto', icon: 'brightness-auto', label: isWeb ? undefined : 'Auto', showSelectedCheck: true },
          ]}
        />
      </Animated.View>

      {/* MINIMIZED STATE (Centered) */}
      <Animated.View 
        style={{ 
          opacity: collapsedOpacity,
          transform: [{ scale: collapsedScale }],
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'absolute',
          inset: 0,
          zIndex: isMinimized ? 1 : 0
        }}
        pointerEvents={!isMinimized ? 'none' : 'auto'}
      >
        <IconButton
          icon={getCycleIcon()}
          mode={themeMode === 'auto' ? 'outlined' : 'contained-tonal'}
          selected onPress={cycleTheme} size={24}
        />
      </Animated.View>
    </View>
  );
};

// --- 4. CONTENT CONTAINER ---

interface SidebarContentProps extends SidebarProps {
  expandAnim: Animated.Value;
}

const SidebarContent = ({ 
  isMinimized, activeRoute, onNavigate, onMinimizeToggle, footer, onClose, expandAnim 
}: SidebarContentProps) => {
  const theme = useTheme();
  
  const renderItem = (item: SidebarConfigItem) => {
    if (item.children?.length) {
      return (
        <SidebarGroup 
          key={item.key} 
          item={item} 
          isMinimized={!!isMinimized} 
          activeRoute={activeRoute} 
          onNavigate={onNavigate} 
          onMinimizeToggle={onMinimizeToggle}
          onClose={onClose}
          expandAnim={expandAnim}
        />
      );
    }
    return (
      <SidebarItem
        key={item.key} 
        icon={item.icon} 
        label={item.label}
        isMinimized={isMinimized} 
        isActive={activeRoute === item.key} 
        expandAnim={expandAnim}
        onPress={() => { 
          onNavigate(item.key); 
          onClose(); 
        }}
      />
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1">
      
      {/* HEADER SECTION */}
      <View 
        className={`h-16 flex-row items-center mb-2 ${
            isMinimized ? 'justify-center px-0' : 'justify-between pl-5 pr-2'
        }`}
      >
        {/* App Title with Fade Animation */}
        {!isMinimized && (
          <Animated.View style={{ opacity: expandAnim }}>
            <Text variant="titleLarge" className="font-bold text-primary">
                {APP_NAME}
            </Text>
          </Animated.View>
        )}

        {/* Menu Toggle (Web/Drawer Mode) */}
        {onMinimizeToggle && (
            <IconButton
                icon={isMinimized ? 'menu' : 'menu-open'}
                onPress={() => onMinimizeToggle(!isMinimized)}
                size={24}
                mode={isMinimized ? 'contained' : 'contained-tonal'}
            />
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {SIDEBAR_CONFIG.filter(i => i.position === 'top').map(renderItem)}
      </ScrollView>

      <View>
        <View className="pb-2">
          {SIDEBAR_CONFIG.filter(i => i.position === 'bottom').map(renderItem)}
        </View>
        <ThemeSwitcher expandAnim={expandAnim} isMinimized={!!isMinimized} />
        {footer && <View className="px-4 py-2 opacity-50">{footer}</View>}
      </View>
    </SafeAreaView>
  );
};


export default function Sidebar(props: SidebarProps) {
  const { isOpen, onClose, isMinimized, onMinimizeToggle } = props;
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  
  const SIDEBAR_WIDTH = 320;
  const MINIMIZED_WIDTH = 80;
  const isWeb = Platform.OS === 'web';
  const shouldUseDrawerMode = isWeb;

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(isMinimized ? 0 : 1)).current;
  const widthAnim = useRef(new Animated.Value(shouldUseDrawerMode && isMinimized ? MINIMIZED_WIDTH : SIDEBAR_WIDTH)).current;

  const [visible, setVisible] = useState(isOpen);
  const isUserOverride = useRef(false);

  // Auto-minimize logic for Web based on screen width
  useEffect(() => {
    if (shouldUseDrawerMode && !isUserOverride.current) {
      if (screenWidth < 1200 && !isMinimized) onMinimizeToggle?.(true);
      else if (screenWidth >= 1200 && isMinimized) onMinimizeToggle?.(false);
    }
  }, [screenWidth, shouldUseDrawerMode]);

  // Handle Width & Expand animations for Drawer Mode
  useEffect(() => {
    if (shouldUseDrawerMode) {
      Animated.parallel([
        Animated.timing(expandAnim, { toValue: isMinimized ? 0 : 1, duration: 300, useNativeDriver: false, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(widthAnim, { toValue: isMinimized ? MINIMIZED_WIDTH : SIDEBAR_WIDTH, duration: 300, useNativeDriver: false, easing: Easing.inOut(Easing.ease) })
      ]).start();
    } else {
      expandAnim.setValue(1); 
    }
  }, [isMinimized, shouldUseDrawerMode]);

  // Handle Slide/Fade animations for Mobile Modal Mode
  useEffect(() => {
    if (shouldUseDrawerMode) return;

    if (isOpen) {
      setVisible(true);
      slideAnim.setValue(-SIDEBAR_WIDTH); 
      
      Animated.parallel([
        Animated.timing(slideAnim, { 
            toValue: 0, 
            duration: 300, 
            useNativeDriver: true, 
            easing: Easing.out(Easing.poly(4))
        }),
        Animated.timing(fadeAnim, { 
            toValue: 1, 
            duration: 300, 
            useNativeDriver: true 
        }),
      ]).start();
    } else {
      // Closing Animation
      Animated.parallel([
        Animated.timing(slideAnim, { 
            toValue: -SIDEBAR_WIDTH, 
            duration: 250, 
            useNativeDriver: true, 
            easing: Easing.in(Easing.poly(4)) 
        }),
        Animated.timing(fadeAnim, { 
            toValue: 0, 
            duration: 250, 
            useNativeDriver: true 
        }),
      ]).start(() => {
          setVisible(false);
      });
    }
  }, [isOpen, shouldUseDrawerMode]);

  if (shouldUseDrawerMode) {
    return (
      <Animated.View
        className="h-full border-r overflow-hidden"
        style={{ width: widthAnim, backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }}
      >
        <SidebarContent 
          {...props} 
          expandAnim={expandAnim}
          onNavigate={(r) => { props.onNavigate(r); }} 
          onMinimizeToggle={(val) => { isUserOverride.current = true; onMinimizeToggle?.(val); }}
        />
      </Animated.View>
    );
  }

  return (
    <Modal 
      transparent 
      visible={visible} 
      onRequestClose={onClose} 
      animationType="none"
      statusBarTranslucent
    >
      <View className="flex-1 absolute inset-0"> 
        {/* Backdrop */}
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={onClose} 
          className="absolute inset-0"
        >
          <Animated.View 
            className="absolute inset-0 bg-black/50" 
            style={{ opacity: fadeAnim }} 
          />
        </TouchableOpacity>

        <Animated.View
          className="absolute left-0 top-0 bottom-0 shadow-xl"
          style={{
            width: SIDEBAR_WIDTH, 
            transform: [{ translateX: slideAnim }],
            backgroundColor: theme.colors.surface, 
            elevation: 16,
          }}
        >
          <SidebarContent 
            {...props} 
            expandAnim={new Animated.Value(1)}
            onMinimizeToggle={undefined} 
          />
        </Animated.View>
      </View>
    </Modal>
  );
}