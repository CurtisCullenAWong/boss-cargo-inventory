import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {
  useTheme,
  IconButton,
  Text,
  TouchableRipple,
  SegmentedButtons
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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

// --- CONSTANTS ---
const IS_WEB = Platform.OS === 'web';

// Width
const SIDEBAR_WIDTH = IS_WEB ? 300 : 280;
const MINIMIZED_WIDTH = 80;

// Item Dimensions
const ITEM_HEIGHT = 44;
const ITEM_MARGIN_Y = 4;
const ITEM_RADIUS = 10;
const ITEM_PADDING_X = 10;
const ITEM_PADDING_X_MINIMIZED = 12;

// Icon Sizes
const ICON_SIZE = 24;
const CHILD_ICON_SIZE = 20;
const CHEVRON_ICON_SIZE = 20;

// Indentation
const CHILD_INDENT = 32;

// --- 2. MENU ITEMS & GROUPS ---

const SidebarItem = React.memo(({
  icon, label, isMinimized, isActive, onPress, onPressIn, isChild, hasChildren, animatedIconStyle, expandAnim
}: {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  isMinimized?: boolean;
  isActive?: boolean;
  onPress: () => void;
  onPressIn?: (e: any) => void;
  isChild?: boolean;
  hasChildren?: boolean;
  animatedIconStyle?: any;
  expandAnim: Animated.Value;
}) => {
  const theme = useTheme();

  const bgColor = isActive ? theme.colors.secondaryContainer : 'transparent';
  const textColor = isActive 
    ? theme.colors.onSecondaryContainer 
    : theme.colors.onSurfaceVariant;
  const iconColor = isActive 
    ? theme.colors.onSecondaryContainer 
    : theme.colors.onSurfaceVariant;

  const iconSize = isChild ? CHILD_ICON_SIZE : ICON_SIZE;
  const labelVariant = isChild ? 'bodyMedium' : 'bodyLarge';

  const basePaddingLeft = isMinimized 
    ? ITEM_PADDING_X_MINIMIZED 
    : isChild 
      ? ITEM_PADDING_X + CHILD_INDENT 
      : ITEM_PADDING_X;
  
  const basePaddingRight = isMinimized ? ITEM_PADDING_X_MINIMIZED : ITEM_PADDING_X;

  const textOpacity = expandAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  });

  return (
    <View style={{ marginVertical: ITEM_MARGIN_Y, marginHorizontal: isMinimized ? 8 : 12 }}>
      <TouchableRipple
        onPress={onPress}
        onPressIn={onPressIn}
        borderless={false}
        style={{
          height: ITEM_HEIGHT,
          justifyContent: 'center',
          backgroundColor: bgColor,
          borderRadius: ITEM_RADIUS,
          overflow: 'hidden'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: isMinimized ? 'center' : 'flex-start',
            paddingLeft: basePaddingLeft,
            paddingRight: basePaddingRight
          }}
        >
          {/* ICON */}
          {(icon || !isChild) && (
            <View style={{ marginRight: isMinimized ? 0 : 12 }}>
              <MaterialCommunityIcons
                name={icon || 'circle-small'}
                size={iconSize}
                color={iconColor}
              />
            </View>
          )}

          {/* LABEL */}
          <Animated.View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              opacity: textOpacity,
              display: isMinimized ? 'none' : 'flex',
            }}
          >
            <Text
              variant={labelVariant}
              style={{
                color: textColor,
                flex: 1,
              }}
            >
              {label}
            </Text>

            {hasChildren && (
              <Animated.View style={[{ marginLeft: 8 }, animatedIconStyle]}>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={CHEVRON_ICON_SIZE}
                  color={iconColor}
                />
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </TouchableRipple>
    </View>
  );
});

const MinimizedGroupOverlay = ({
  item,
  activeRoute,
  onNavigate,
  onCloseSidebar,
  onCloseOverlay,
  anchor
}: {
  item: SidebarConfigItem;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onCloseSidebar: () => void;
  onCloseOverlay: () => void;
  anchor?: { x: number; y: number } | null;
}) => {
  const theme = useTheme();

  const defaultTop = IS_WEB ? 100 : 50;
  const defaultLeft = 80;

  const topPos = anchor ? Math.max(8, anchor.y - 12) : defaultTop;
  const leftPos = anchor ? Math.max(8, anchor.x - 16) : defaultLeft;

  return (
    <Modal
      transparent
      visible={true}
      onRequestClose={onCloseOverlay}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <TouchableOpacity
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        activeOpacity={1}
        onPress={onCloseOverlay}
      />

            <View
              style={{
                position: 'absolute',
                top: topPos,
                left: leftPos,
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
                elevation: 8,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 2 },
                minWidth: 150,
                zIndex: 9999,
              }}
            >
              {/* Header / Title */}
              <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text
                  variant="titleMedium"
                  numberOfLines={1}
                  style={{ color: theme.colors.onSurface, fontWeight: '600' }}
                >
                  {item.label}
                </Text>
              </View>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: theme.colors.outlineVariant, opacity: 0.6 }} />

              {/* Children */}
              <View style={{ paddingVertical: 4 }}>
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
                      marginVertical: 2,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialCommunityIcons
                        name={child.icon || 'circle-small'}
                        size={16}
                        color={activeRoute === child.key ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        variant="labelLarge"
                        numberOfLines={1}
                        style={{ color: activeRoute === child.key ? theme.colors.onSecondaryContainer : theme.colors.onSurface }}
                      >
                        {child.label}
                      </Text>
                    </View>
                  </TouchableRipple>
                ))}
              </View>
            </View>
        </Modal>
    );
};

const SidebarGroup = ({ 
  item, 
  isMinimized, 
  activeRoute, 
  onNavigate, 
  onClose, 
  expandAnim 
}: {
  item: SidebarConfigItem;
  isMinimized: boolean;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onClose: () => void;
  expandAnim: Animated.Value;
}) => {
  const { expandedGroups, toggleGroup } = useSidebarContext();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);

  const isExpanded = expandedGroups.has(item.key);
  const groupExpandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  const isChildActive = useMemo(
    () => item.children?.some(child => child.key === activeRoute),
    [item.children, activeRoute]
  );

  useEffect(() => {
    Animated.timing(groupExpandAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [isExpanded]);

  const handlePress = () => {
    if (isMinimized) {
      setIsOverlayOpen(true);
    } else {
      toggleGroup(item.key);
    }
  };

  const handlePressIn = (e: any) => {
    if (isMinimized && e?.nativeEvent) {
      const { pageX, pageY } = e.nativeEvent;
      setAnchor({ x: pageX, y: pageY });
    }
  };

  const arrowRotation = groupExpandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const contentHeight = groupExpandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (item.children?.length || 0) * (ITEM_HEIGHT + (ITEM_MARGIN_Y * 2))],
  });

  return (
    <View>
      <SidebarItem
        icon={item.icon}
        label={item.label}
        isMinimized={isMinimized}
        isActive={isMinimized && isChildActive}
        onPress={handlePress}
        onPressIn={handlePressIn}
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
          onCloseOverlay={() => {
            setIsOverlayOpen(false);
            setAnchor(null);
          }}
          anchor={anchor}
        />
      )}
    </View>
  );
};

// --- 3. THEME SWITCHER ---

const ThemeSwitcher = ({ 
  expandAnim, 
  isMinimized 
}: { 
  expandAnim: Animated.Value; 
  isMinimized: boolean; 
}) => {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useAppTheme();

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

  const expandedOpacity = expandAnim.interpolate({ 
    inputRange: [0, 0.5, 1], 
    outputRange: [0, 0, 1] 
  });
  
  const collapsedOpacity = expandAnim.interpolate({ 
    inputRange: [0, 0.5, 1], 
    outputRange: [1, 0, 0] 
  });

  return (
    <View 
      style={{ 
        borderTopWidth: 1,
        borderColor: theme.colors.outlineVariant,
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 8,
        paddingTop: 12
      }}
    >
      {/* EXPANDED */}
      <Animated.View
        style={{
          opacity: expandedOpacity,
          display: isMinimized ? 'none' : 'flex'
        }}
      >
        <Text 
          variant="labelSmall" 
          style={{
            color: theme.colors.onSurfaceVariant,
            marginBottom: 8,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            opacity: 0.7
          }}
        >
          App Theme
        </Text>
        <SegmentedButtons
          value={themeMode}
          onValueChange={(val) => setThemeMode(val as ThemeMode)}
          density="small"
          buttons={[
            { 
              value: 'light', 
              icon: 'white-balance-sunny', 
              label: IS_WEB ? undefined : 'Light' 
            },
            { 
              value: 'dark', 
              icon: 'weather-night', 
              label: IS_WEB ? undefined : 'Dark' 
            },
            { 
              value: 'auto', 
              icon: 'brightness-auto', 
              label: IS_WEB ? undefined : 'Auto' 
            },
          ]}
        />
      </Animated.View>

      {/* MINIMIZED */}
      <Animated.View
        style={{
          opacity: collapsedOpacity,
          display: isMinimized ? 'flex' : 'none',
          alignItems: 'center'
        }}
      >
        <IconButton
          icon={getCycleIcon()}
          mode="contained-tonal"
          onPress={cycleTheme}
          size={20}
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
  isMinimized, 
  activeRoute, 
  onNavigate, 
  onMinimizeToggle, 
  footer, 
  onClose, 
  expandAnim
}: SidebarContentProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const renderItem = (item: SidebarConfigItem) => {
    if (item.children?.length) {
      return (
        <SidebarGroup
          key={item.key}
          item={item}
          isMinimized={!!isMinimized}
          activeRoute={activeRoute}
          onNavigate={onNavigate}
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
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.surface,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* HEADER SECTION */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: isMinimized ? 'center' : 'flex-start',
          justifyContent: isMinimized ? 'center' : 'space-between',
          height: isMinimized ? 64 : 'auto',
          minHeight: isMinimized ? 64 : 100,
          paddingTop: isMinimized ? 0 : 16,
          paddingBottom: isMinimized ? 0 : 12,
          paddingLeft: isMinimized ? 0 : 16,
          paddingRight: isMinimized ? 0 : 8,
          marginBottom: 8
        }}
      >
        {/* App Title */}
        {!isMinimized && (
          <Animated.View style={{ minWidth: "80%", alignItems: 'center', opacity: expandAnim, marginLeft: 8 }}>
            <View 
              style={{
                backgroundColor: theme.colors.primary,
                padding: 8,
                borderRadius: 10,
                alignItems: 'flex-end'
              }}
            >
              <Text
                variant="displayLarge"
                style={{
                  color: theme.colors.onPrimary,
                }}
              >
                {process.env.EXPO_PUBLIC_SHORT_APP_NAME}
              </Text>
              <Text
                variant="titleLarge"
                style={{
                  color: theme.colors.onPrimary,
                  marginTop: -14,
                }}
              >
                {process.env.EXPO_PUBLIC_APP_ABBREVIATION}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Menu Toggle */}
        {onMinimizeToggle && (
          <IconButton
            icon={isMinimized ? 'menu' : 'menu-open'}
            onPress={() => onMinimizeToggle(!isMinimized)}
            size={22}
            style={{ 
              margin: 0,
              marginTop: isMinimized ? 0 : 8
            }}
          />
        )}
      </View>

      {/* MENU ITEMS */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      >
        {SIDEBAR_CONFIG.filter(i => i.position === 'top').map(renderItem)}
      </ScrollView>

      {/* FOOTER AREA */}
      <View style={{ paddingBottom: 12 }}>
        {SIDEBAR_CONFIG.filter(i => i.position === 'bottom').map(renderItem)}
        <ThemeSwitcher expandAnim={expandAnim} isMinimized={!!isMinimized} />
        {!isMinimized && footer && (
          <Animated.View 
            style={{ 
              opacity: expandAnim, 
              paddingHorizontal: 16, 
              paddingVertical: 8 
            }}
          >
            {footer}
          </Animated.View>
        )}
      </View>
    </View>
  );
};

// --- 5. MAIN COMPONENT ---

export default function Sidebar(props: SidebarProps) {
  const { isOpen, onClose, isMinimized, onMinimizeToggle } = props;
  const theme = useTheme();

  const shouldUseDrawerMode = IS_WEB;

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(isMinimized ? 0 : 1)).current;
  const widthAnim = useRef(
    new Animated.Value(shouldUseDrawerMode && isMinimized ? MINIMIZED_WIDTH : SIDEBAR_WIDTH)
  ).current;

  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (shouldUseDrawerMode) {
      Animated.parallel([
        Animated.timing(expandAnim, {
          toValue: isMinimized ? 0 : 1,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(widthAnim, {
          toValue: isMinimized ? MINIMIZED_WIDTH : SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease)
        })
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
        style={{
          height: '100%',
          width: widthAnim,
          borderRightWidth: 1,
          borderColor: theme.colors.outlineVariant,
          backgroundColor: theme.colors.surface,
          overflow: 'hidden'
        }}
      >
        <SidebarContent
          {...props}
          expandAnim={expandAnim}
          onNavigate={(r) => { props.onNavigate(r); }}
          onMinimizeToggle={onMinimizeToggle}
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
      <View style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              opacity: fadeAnim
            }}
          />
        </TouchableOpacity>

        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            top: 0,
            width: SIDEBAR_WIDTH,
            transform: [{ translateX: slideAnim }],
            backgroundColor: theme.colors.surface,
            borderRightWidth: 1,
            borderColor: theme.colors.outlineVariant,
            elevation: 16,
          }}
        >
          <SidebarContent
            {...props}
            expandAnim={new Animated.Value(1)}
            isMinimized={false}
            onMinimizeToggle={undefined}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}