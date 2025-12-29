import { useEffect, useRef, useState, useMemo, memo } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import {
  useTheme,
  IconButton,
  Text,
  TouchableRipple,
  SegmentedButtons,
  ActivityIndicator,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme as useAppTheme, type ThemeMode } from '../context/ThemeContext';
import { useSidebarContext } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import { ADMIN_SIDEBAR_CONFIG, type SidebarConfigItem } from './sidebar/adminSidebarConfig';
import { isLogoutRoute } from '../navigator/routes';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimizeToggle?: (minimized: boolean) => void;
  activeRoute: string;
  onNavigate: (route: string) => void;
  footer?: React.ReactNode;
}

const IS_WEB = Platform.OS === 'web';
const SIDEBAR_WIDTH = IS_WEB ? 300 : 280;
const MINIMIZED_WIDTH = 80;
const ITEM_HEIGHT = 36;
const ITEM_MARGIN_Y = 2;
const ITEM_RADIUS = 8;
const ITEM_PADDING_X = 8;
const ITEM_PADDING_X_MINIMIZED = 12;
const ICON_SIZE = 20;
const CHILD_ICON_SIZE = 18;
const CHEVRON_ICON_SIZE = 18;
const CHILD_INDENT = 24;

const SidebarItem = memo(({
  icon, label, isMinimized, isActive, onPress, onPressIn, isChild, hasChildren, animatedIconStyle, expandAnim, isLoading
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
  isLoading?: boolean;
}) => {
  const theme = useTheme();

  const bgColor = isActive ? theme.colors.primaryContainer : 'transparent';
  const contentColor = isActive 
    ? theme.colors.onPrimaryContainer 
    : theme.colors.onSecondary;

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
    <View style={{ marginVertical: ITEM_MARGIN_Y, marginHorizontal: 8 }}>
      <TouchableRipple
        onPress={onPress}
        onPressIn={onPressIn}
        borderless={false}
        disabled={isLoading}
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
          {(icon || !isChild) && (
            <View style={{ marginRight: isMinimized ? 0 : 8 }}>
              {isLoading ? (
                <ActivityIndicator size={iconSize} color={contentColor} />
              ) : (
                <MaterialCommunityIcons
                  name={icon || 'circle-small'}
                  size={iconSize}
                  color={contentColor}
                />
              )}
            </View>
          )}
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
                color: contentColor,
                flex: 1,
              }}
            >
              {label}
            </Text>
            {hasChildren && (
              <Animated.View style={[{ marginLeft: 4 }, animatedIconStyle]}>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={CHEVRON_ICON_SIZE}
                  color={contentColor}
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
                shadowColor: theme.colors.onSurface,
                shadowOpacity: theme.dark ? 0.5 : 0.2,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 2 },
                minWidth: 150,
                zIndex: 9999,
              }}
            >
              <View style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
                <Text
                  variant="titleMedium"
                  numberOfLines={1}
                  style={{ color: theme.colors.onSurface, fontWeight: '600', fontSize: 14 }}
                >
                  {item.label}
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: theme.colors.outlineVariant }} />
              <View style={{ paddingVertical: 2 }}>
                {item.children?.map(child => {
                  const isChildActive = activeRoute === child.key;
                  const childContentColor = isChildActive 
                    ? theme.colors.onSecondaryContainer 
                    : theme.colors.onSurface;
                  
                  return (
                    <TouchableRipple
                      key={child.key}
                      onPress={() => {
                        onNavigate(child.key);
                        onCloseSidebar();
                        onCloseOverlay();
                      }}
                      style={{
                        backgroundColor: isChildActive ? theme.colors.secondaryContainer : 'transparent',
                        paddingHorizontal: 12,
                        height: ITEM_HEIGHT,
                        justifyContent: 'center',
                        borderRadius: 6,
                        marginHorizontal: 4,
                        marginVertical: 1,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons
                          name={child.icon || 'circle-small'}
                          size={CHILD_ICON_SIZE}
                          color={isChildActive ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          variant="labelLarge"
                          numberOfLines={1}
                          style={{ color: childContentColor, fontSize: 13 }}
                        >
                          {child.label}
                        </Text>
                      </View>
                    </TouchableRipple>
                  );
                })}
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
        marginHorizontal: 8,
        marginTop: 8,
        marginBottom: 4,
        paddingTop: 8
      }}
      >
      <View 
        style={{ 
          height: 1,
          backgroundColor: theme.colors.onSecondary,
          opacity: 0.12,
          marginBottom: 8
        }} 
      />
      <Animated.View
        style={{
          opacity: expandedOpacity,
          display: isMinimized ? 'none' : 'flex'
        }}
      >
        <Text 
          variant="labelSmall" 
          style={{
            color: theme.colors.onSecondary,
            marginBottom: 6,
            textAlign: 'center',
            letterSpacing: 0.5,
            fontSize: 10
          }}
        >
          APP THEME
        </Text>
        <SegmentedButtons
          value={themeMode}
          onValueChange={(val) => setThemeMode(val as ThemeMode)}
          density="small"
          theme={{
            colors: {
              secondaryContainer: theme.colors.primaryContainer,
              onSecondaryContainer: theme.colors.onPrimaryContainer,
              surface: 'transparent',
              onSurface: theme.colors.onSecondary,
              outline: theme.colors.onSecondary,
              outlineVariant: theme.colors.onSecondary,
            },
          }}
          buttons={[
            { 
              value: 'light', 
              icon: 'white-balance-sunny', 
              label: IS_WEB ? undefined : 'Light',
            },
            { 
              value: 'dark', 
              icon: 'weather-night', 
              label: IS_WEB ? undefined : 'Dark',
            },
            { 
              value: 'auto', 
              icon: 'brightness-auto', 
              label: IS_WEB ? undefined : 'Auto',
            },
          ]}
        />
      </Animated.View>
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
  const { signOut, isLoggingOut } = useAuth();

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
        isLoading={isLogoutRoute(item.key) && isLoggingOut}
        onPress={() => {
          if (isLogoutRoute(item.key)) {
            void signOut();
          }
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
        backgroundColor: theme.colors.secondary,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: isMinimized ? 'center' : 'flex-start',
          justifyContent: isMinimized ? 'center' : 'flex-start',
          height: isMinimized ? 64 : 'auto',
          minHeight: isMinimized ? 64 : 90,
          paddingTop: isMinimized ? 0 : 12,
          paddingBottom: isMinimized ? 0 : 8,
          paddingLeft: isMinimized ? 0 : 12,
          paddingRight: isMinimized ? 0 : 12,
          marginBottom: 4,
          position: 'relative',
          width: '100%',
          backgroundColor: theme.colors.primary,
        }}
      >
        {!isMinimized && (
          <Animated.View style={{ flex: 1, alignItems: 'center', opacity: expandAnim }}>

            <View 
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
                padding: 6,
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../../assets/favicon.png')} style={{ width: 64, height: 64 }} />
                <Text
                  variant="displayLarge"
                  style={{
                    color: theme.colors.onPrimary,
                    fontSize: 32,
                  }}
                >
                  {process.env.EXPO_PUBLIC_SHORT_APP_NAME}
                </Text>
              </View>
              <Text
                variant="titleLarge"
                style={{
                  color: theme.colors.onPrimary,
                  marginTop: -24,
                  marginLeft: 90,
                  fontSize: 18,
                }}
              >
                {process.env.EXPO_PUBLIC_APP_ABBREVIATION}
              </Text>
            </View>
          </Animated.View>
        )}
        {onMinimizeToggle && isMinimized && (
          <IconButton
            icon="menu"
            onPress={() => onMinimizeToggle(!isMinimized)}
            size={22}
            iconColor={theme.colors.onPrimary}
            style={{ 
              margin: 0,
            }}
          />
        )}
        {onMinimizeToggle && !isMinimized && (
          <Animated.View 
            style={{ 
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 4,
              justifyContent: 'center',
              opacity: expandAnim,
              zIndex: 10
            }}
          >
            <IconButton
              icon="menu-open"
              onPress={() => onMinimizeToggle(!isMinimized)}
              size={20}
              iconColor={theme.colors.onPrimary}
              style={{ 
                margin: 0,
              }}
            />
          </Animated.View>
        )}
      </View>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        {ADMIN_SIDEBAR_CONFIG.filter(i => i.position === 'top').map(renderItem)}
      </ScrollView>
      <View style={{ paddingBottom: 8 }}>
        {ADMIN_SIDEBAR_CONFIG.filter(i => i.position === 'bottom').map(renderItem)}
        <ThemeSwitcher expandAnim={expandAnim} isMinimized={!!isMinimized} />
        {!isMinimized && footer && (
          <Animated.View 
            style={{ 
              opacity: expandAnim, 
              paddingHorizontal: 12, 
              paddingVertical: 6 
            }}
          >
            {footer}
          </Animated.View>
        )}
      </View>
    </View>
  );
};

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
          backgroundColor: theme.colors.secondary,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: theme.colors.onSecondary,
            opacity: 0.12,
            zIndex: 1
          }}
        />
        <SidebarContent
          {...props}
          expandAnim={expandAnim}
          onNavigate={props.onNavigate}
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
              backgroundColor: theme.colors.surface,
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, theme.dark ? 0.7 : 0.6]
              })
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
            backgroundColor: theme.colors.secondary,
            elevation: 16,
          }}
        >
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: theme.colors.onSecondary,
              opacity: 0.12,
              zIndex: 1
            }}
          />
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