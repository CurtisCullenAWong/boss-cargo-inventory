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
import { useSidebarContext } from '../../context/SidebarContext';

// --- 1. CONFIGURATION ---

export type SidebarConfigItem = {
  key: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  position: 'top' | 'bottom';
  children?: SidebarConfigItem[];
};

export const SIDEBAR_CONFIG: SidebarConfigItem[] = [
  {
    key: 'Inbound Operations',
    label: 'Inbound Operations',
    icon: 'truck-plus',
    position: 'top',
    children: [
      { key: 'Purchase Request', label: 'Purchase Request', icon: 'cash', position: 'top' },
      { key: 'Purchase Order', label: 'Purchase Order', icon: 'cart', position: 'top' },
      { key: 'Receiving Report', label: 'Receiving Report', icon: 'file-document-check', position: 'top' },
    ]
  },
  {
    key: 'Outbound Operations',
    label: 'Outbound Operations',
    icon: 'truck-minus',
    position: 'top',
    children: [
      { key: 'Returned Items', label: 'Returned Items', icon: 'archive-arrow-up', position: 'top' },
      { key: 'Issuance Report', label: 'Issuance Report', icon: 'file-document-alert', position: 'top' },
    ]
  },
  {
    key: 'Inventory', label: 'Inventory', icon: 'clipboard-list', position: 'top',
    children: [
      { key: 'Items List', label: 'Items List', icon: 'format-list-bulleted', position: 'top' },
      { key: 'Fix Asset', label: 'Fix Asset', icon: 'cube', position: 'top' },
      { key: 'Consumable Asset', label: 'Consumable Asset', icon: 'package-variant', position: 'top' },
    ]
  },
  {
    key: 'System',
    label: 'System',
    icon: 'cogs',
    position: 'top',
    children: [
      { key: 'Dashboard', label: 'Dashboard', icon: 'view-dashboard', position: 'top' },
      { key: 'Supplier List', label: 'Supplier List', icon: 'account-group', position: 'top' },
      { key: 'User Management', label: 'User Management', icon: 'account-group', position: 'top' },
    ]
  },
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

// --- CONSTANTS FOR LAYOUT ---
const ITEM_HEIGHT = 36;
const ITEM_MARGIN = 2;
const ITEM_TOTAL_HEIGHT = ITEM_HEIGHT + ITEM_MARGIN;
const SIDEBAR_WIDTH = 260;
const MINIMIZED_WIDTH = 64;

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

  const wrapperClasses = isMinimized ? 'items-center px-0' : 'px-2';

  let rippleClasses = isMinimized
    ? 'w-9 justify-center px-0' 
    : 'w-full justify-start pr-3';

  if (!isMinimized) {
    rippleClasses += isChild ? ' pl-8' : ' pl-2';
  }

  const textOpacity = expandAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  });

  return (
    <View className={`mb-[2px] ${wrapperClasses}`}>
      <TouchableRipple
        onPress={onPress} borderless
        style={{ backgroundColor: bgColor, overflow: 'hidden' }}
        className={`h-9 rounded-md flex-row items-center ${rippleClasses}`}
      >
        <>
          {(icon || !isChild) && (
            <View className={isMinimized ? '' : 'mr-2'}>
              <MaterialCommunityIcons
                name={icon || 'circle-small'}
                size={isChild ? 16 : 18} 
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
              variant="labelMedium"
              numberOfLines={1}
              className={`flex-1`}
              style={{ color: textColor, fontSize: 13 }}
            >
              {label}
            </Text>
            {hasChildren && (
              <Animated.View style={animatedIconStyle}>
                <MaterialCommunityIcons name="chevron-down" size={16} color={theme.colors.onSurfaceVariant} />
              </Animated.View>
            )}
          </Animated.View>
        </>
      </TouchableRipple>
    </View>
  );
});

const MinimizedGroupOverlay = ({
    item,
    activeRoute,
    onNavigate,
    onCloseSidebar,
    onCloseOverlay
}: {
    item: SidebarConfigItem;
    activeRoute: string;
    onNavigate: (route: string) => void;
    onCloseSidebar: () => void;
    onCloseOverlay: () => void;
}) => {
    const theme = useTheme();

    const isWeb = Platform.OS === 'web';
    const leftPosition = isWeb ? MINIMIZED_WIDTH : 0; 

    return (
        <Modal
            transparent
            visible={true}
            onRequestClose={onCloseOverlay}
            animationType="fade"
            statusBarTranslucent={false}
        >
            <TouchableOpacity
                className="absolute inset-0"
                activeOpacity={1}
                onPress={onCloseOverlay}
            />

            <View
                style={{
                    position: 'absolute',
                    top: Platform.OS === 'web' ? 100 : 50,
                    left: leftPosition,
                    backgroundColor: theme.colors.surface,
                    borderRadius: 8,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    shadowOffset: { width: 0, height: 2 },
                    minWidth: 150,
                    paddingVertical: 4,
                    zIndex: 9999,
                    ...(!isWeb && {
                        left: 0,
                        width: SIDEBAR_WIDTH,
                        paddingHorizontal: 8,
                    })
                }}
            >
                {item.children?.map(child => (
                    <TouchableRipple
                        key={child.key}
                        onPress={() => {
                            onNavigate(child.key);
                            onCloseSidebar();
                            onCloseOverlay();
                        }}
                        style={{
                            backgroundColor: activeRoute === child.key ? theme.colors.secondaryContainer : 'transparent',
                            paddingHorizontal: 16,
                            height: ITEM_HEIGHT,
                            justifyContent: 'center',
                            borderRadius: 6,
                            marginHorizontal: 4,
                        }}
                    >
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons
                                name={child.icon || 'circle-small'}
                                size={16}
                                color={activeRoute === child.key ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant}
                                style={{ marginRight: 8 }}
                            />
                            <Text
                                variant="labelMedium"
                                numberOfLines={1}
                                style={{ color: activeRoute === child.key ? theme.colors.onSecondaryContainer : theme.colors.onSurface }}
                            >
                                {child.label}
                            </Text>
                        </View>
                    </TouchableRipple>
                ))}
            </View>
        </Modal>
    );
};

const SidebarGroup = ({ item, isMinimized, activeRoute, onNavigate, onClose, expandAnim }: {
  item: SidebarConfigItem;
  isMinimized: boolean;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onMinimizeToggle?: (val: boolean) => void;
  onClose: () => void;
  expandAnim: Animated.Value;
}) => {
  const { expandedGroups, toggleGroup } = useSidebarContext();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const isExpanded = expandedGroups.has(item.key);
  const groupExpandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  const isChildActive = useMemo(() => item.children?.some(child => child.key === activeRoute), [item.children, activeRoute]);

  useEffect(() => {
    if (isChildActive && !isExpanded) {
      toggleGroup(item.key);
    }
  }, [isChildActive]);

  useEffect(() => {
    Animated.timing(groupExpandAnim, {
      toValue: isExpanded ? 1 : 0, duration: 300, useNativeDriver: false, easing: Easing.inOut(Easing.ease),
    }).start();
  }, [isExpanded, groupExpandAnim]);

  const handlePress = () => {
    if (isMinimized) {
      setIsOverlayOpen(true);
    } else {
      toggleGroup(item.key);
    }
  };

  const arrowRotation = groupExpandAnim.interpolate({
    inputRange: [0, 1], outputRange: ['0deg', '180deg'],
  });

  const contentHeight = groupExpandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (item.children?.length || 0) * ITEM_TOTAL_HEIGHT],
  });

  return (
    <View>
      <SidebarItem
        icon={item.icon}
        label={item.label}
        isMinimized={isMinimized}
        isActive={isChildActive}
        onPress={handlePress}
        hasChildren={!isMinimized}
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
      
      {isMinimized && isOverlayOpen && (
        <MinimizedGroupOverlay
            item={item}
            activeRoute={activeRoute}
            onNavigate={onNavigate}
            onCloseSidebar={onClose}
            onCloseOverlay={() => setIsOverlayOpen(false)}
        />
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

  const containerHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 80]
  });

  return (
    <Animated.View
      className="relative overflow-hidden"
      style={{
        borderTopWidth: 1,
        borderColor: theme.colors.outlineVariant,
        height: containerHeight
      }}
    >

      {/* EXPANDED STATE */}
      <Animated.View
        className="absolute w-full p-4 justify-center h-full"
        style={{ opacity: expandedOpacity, zIndex: isMinimized ? 0 : 1 }}
        pointerEvents={isMinimized ? 'none' : 'auto'}
      >
        <View className="pt-2 px-4 w-full items-center">
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginBottom: 6 }}
            >Switch Theme</Text>
          <SegmentedButtons
            value={themeMode}
            onValueChange={(val) => setThemeMode(val as ThemeMode)}
            density="small"
            style={{ transform: [{ scale: 0.9 }] }}
            buttons={[
              { value: 'light', icon: 'white-balance-sunny', label: isWeb ? undefined : 'Light', showSelectedCheck: true },
              { value: 'dark', icon: 'weather-night', label: isWeb ? undefined : 'Dark', showSelectedCheck: true },
              { value: 'auto', icon: 'brightness-auto', label: isWeb ? undefined : 'Auto', showSelectedCheck: true },
            ]}
          />
        </View>
      </Animated.View>

      {/* MINIMIZED STATE */}
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
          selected onPress={cycleTheme} size={20}
          style={{ margin: 0 }}
        />
      </Animated.View>
    </Animated.View>
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
    <SafeAreaView edges={['top', 'bottom']} className="flex-1" style={{ backgroundColor: theme.colors.surface }}>

      {/* --- FIX START: HEADER SECTION --- */}
      <View
        className={`flex-row items-center mb-1 ${
          isMinimized
            ? 'h-12 justify-center px-0'
            : 'h-auto min-h-[100px] pt-4 pb-2 justify-between pl-4 pr-1'
        }`}
      >
        {/* App Title with Fade Animation */}
        {!isMinimized && (
          <Animated.View style={{ opacity: expandAnim }}>
            <View className="flex-col items-end ml-3" style={{backgroundColor: theme.colors.onPrimary, padding: 6, borderRadius: 8}}>

              {/* VISTA */}
              <Text
                variant="displayLarge"
                className="text-primary leading-none"
                style={{color: theme.colors.primary}}
              >
                {process.env.EXPO_PUBLIC_SHORT_APP_NAME}
              </Text>

              {/* AIMS */}
              <Text
                variant="bodyLarge"
                className="mt-[-16px]"
                style={{color: theme.colors.primary}}
              >
                {process.env.EXPO_PUBLIC_APP_ABBREVIATION}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Menu Toggle (Web/Drawer Mode) */}
        {onMinimizeToggle && (
          <IconButton
            icon={isMinimized ? 'menu' : 'menu-open'}
            onPress={() => onMinimizeToggle(!isMinimized)}
            size={20}
            style={{ margin: 0 }}
            className={isMinimized ? 'mt-3 mx-2' : 'self-start mt-2 ml-2'}
          />
        )}
      </View>
      {/* --- FIX END --- */}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}
      >
        {SIDEBAR_CONFIG.filter(i => i.position === 'top').map(renderItem)}
      </ScrollView>

      <View>
        <View className="pb-1">
          {SIDEBAR_CONFIG.filter(i => i.position === 'bottom').map(renderItem)}
        </View>
        <ThemeSwitcher expandAnim={expandAnim} isMinimized={!!isMinimized} />
        {footer && <View className="px-3 py-1 opacity-50">{footer}</View>}
      </View>
    </SafeAreaView>
  );
};


export default function Sidebar(props: SidebarProps) {
  const { isOpen, onClose, isMinimized, onMinimizeToggle } = props;
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  // Reduced sidebar widths for compactness (re-defined from constants)
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
        style={{
          width: widthAnim,
          borderColor: theme.colors.outlineVariant,
          borderWidth: 1,
          borderStyle: 'solid',
        }}
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
            borderColor: theme.colors.outlineVariant, // Add outline
            borderWidth: 1,
            borderStyle: 'solid',
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