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
import { useTheme as useAppTheme, type ThemeMode } from '../../backend/context/ThemeContext';
import { useSidebarContext } from '../../backend/context/SidebarContext';
import { useAuth } from '../../backend/context/AuthContext';
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
const SIDEBAR_WIDTH = IS_WEB ? 250 : 300;
const MINIMIZED_WIDTH = 80;
const ITEM_HEIGHT = 40;
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

  const bgColor = isActive
    ? theme.colors.primaryContainer
    : 'transparent';
  const contentColor = isActive
    ? theme.colors.onPrimaryContainer
    : theme.colors.onSurface;

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
    <View className="my-[2px] mx-2">
      <TouchableRipple
        onPress={onPress}
        onPressIn={onPressIn}
        borderless={false}
        disabled={isLoading}
        className="justify-center rounded-lg overflow-hidden"
        style={{
          height: ITEM_HEIGHT,
          backgroundColor: bgColor,
        }}
      >
        <View
          className="flex-row items-center"
          style={{
            justifyContent: isMinimized ? 'center' : 'flex-start',
            paddingLeft: basePaddingLeft,
            paddingRight: basePaddingRight
          }}
        >
          {(icon || !isChild) && (
            <View className={isMinimized ? "mr-0" : "mr-3"}>
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
            className="flex-1 flex-row items-center"
            style={{
              opacity: textOpacity,
              display: isMinimized ? 'none' : 'flex',
            }}
          >
            <Text
              variant={labelVariant}
              numberOfLines={1}
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
        className="absolute inset-0"
        activeOpacity={1}
        onPress={onCloseOverlay}
      />
      <View
        className="absolute rounded-lg p-1 min-w-[160px] z-50 shadow-lg"
        style={{
          top: topPos,
          left: leftPos,
          backgroundColor: theme.colors.surface,
          elevation: 8,
        }}
      >
        <View className="px-3 py-2">
          <Text
            variant="titleMedium"
            numberOfLines={1}
            className="font-semibold text-sm"
            style={{ color: theme.colors.onSurface }}
          >
            {item.label}
          </Text>
        </View>
        <View className="h-[1px] w-full" style={{ backgroundColor: theme.colors.outlineVariant }} />
        
        <View className="py-1">
          {item.children?.map(child => {
            const isChildActive = activeRoute === child.key;
            return (
              <TouchableRipple
                key={child.key}
                onPress={() => {
                  onNavigate(child.key);
                  onCloseSidebar();
                  onCloseOverlay();
                }}
                className="mx-1 my-[2px] rounded-md justify-center px-3"
                style={{
                  backgroundColor: isChildActive ? theme.colors.primaryContainer : 'transparent',
                  height: ITEM_HEIGHT,
                }}
              >
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name={child.icon || 'circle-small'}
                    size={CHILD_ICON_SIZE}
                    color={isChildActive ? theme.colors.onPrimaryContainer : theme.colors.onSurface}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    variant="labelLarge"
                    numberOfLines={1}
                    style={{ 
                      color: isChildActive ? theme.colors.onPrimaryContainer : theme.colors.onSurface, 
                      fontSize: 13 
                    }}
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
    outputRange: [0, (item.children?.length || 0) * (ITEM_HEIGHT + 4)],
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
    <View className="mx-2 mt-2 mb-1 pt-2">
      <View 
        className="h-[1px] mb-2 opacity-10"
        style={{ backgroundColor: theme.colors.outline }} 
      />
      <Animated.View
      className={'my-4'}
        style={{
          opacity: expandedOpacity,
          display: isMinimized ? 'none' : 'flex'
        }}
      >
        <Text 
          variant="labelSmall" 
          className="mb-1.5 text-center tracking-widest text-[10px]"
          style={{ color: theme.colors.onBackground }}
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
              onSurface: theme.colors.onBackground,
              outline: theme.colors.onBackground,
              outlineVariant: theme.colors.onBackground,
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
        className="items-center"
        style={{
          opacity: collapsedOpacity,
          display: isMinimized ? 'flex' : 'none',
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
      className={`flex-1 w-full pt-[${insets.top}] pb-[${insets.bottom}]`}
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Header Section */}
      {!IS_WEB ? (
        // Mobile Header
        <View
          className="flex-row items-center px-5 py-4 mb-2 self-center w-full justify-center"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <View className="justify-center my-4 mr-2">
          <Image
            source={require('../../assets/favicon.png')}
            className="w-24 h-24"
            resizeMode="contain"
          />
          </View>
          <View className="justify-center flex-row align-middle">
            <View className="justify-center mt-6 mr-1">
            <Text
              variant="displayLarge"
              className="font-bold"
              style={{ color: theme.colors.onPrimary }}
            >
              {process.env.EXPO_PUBLIC_SHORT_APP_NAME}
            </Text>
            </View>
            <View className="justify-center mt-14">
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.onPrimary }}
            >
              {process.env.EXPO_PUBLIC_APP_ABBREVIATION}
            </Text>
            </View>
          </View>
        </View>
      ) : (
        // Web / Desktop Header
        <View
          className={`flex-row mb-1 w-full relative
            ${isMinimized ? 'items-center justify-center h-16 min-h-16 p-0' : 'items-start justify-start pt-3 pb-2 px-3 min-h-[90px]'}
          `}
          style={{ backgroundColor: theme.colors.primary }}
        >
          {!isMinimized && (
            <Animated.View 
              className="flex-1 items-center" 
              style={{ opacity: expandAnim }}
            >
              <View 
                className="rounded-lg p-1.5 items-center mr-[20%] justify-center"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <View className="flex-row items-center justify-center">
                  <Image 
                    source={require('../../assets/favicon.png')} 
                    style={{ width: 64, height: 64 }}
                    resizeMode="contain"
                  />
                  <Text
                    variant="displayLarge"
                    className="text-3xl ml-1"
                    style={{ color: theme.colors.onPrimary }}
                  >
                    {process.env.EXPO_PUBLIC_SHORT_APP_NAME}
                  </Text>
                </View>
                <Text
                  variant="titleLarge"
                  className="mt-[-7%] ml-[70%] text-lg"
                  style={{ color: theme.colors.onPrimary }}
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
              className='m-0'
            />
          )}
          
          {onMinimizeToggle && !isMinimized && (
            <Animated.View 
              className="absolute top-0 bottom-0 right-1 justify-center z-10"
              style={{ opacity: expandAnim }}
            >
              <IconButton
                icon="menu-open"
                onPress={() => onMinimizeToggle(!isMinimized)}
                className='m-0'
                size={22}
                iconColor={theme.colors.onPrimary}
              />
            </Animated.View>
          )}
        </View>
      )}

      <ScrollView
        className="flex-1 py-2"
        showsVerticalScrollIndicator={false}
      >
        {ADMIN_SIDEBAR_CONFIG.filter(i => i.position === 'top').map(renderItem)}
      </ScrollView>

      <View className="pb-2">
        {ADMIN_SIDEBAR_CONFIG.filter(i => i.position === 'bottom').map(renderItem)}
        <ThemeSwitcher expandAnim={expandAnim} isMinimized={!!isMinimized} />
        {!isMinimized && footer && (
          <Animated.View 
            className="px-3 py-1.5"
            style={{ opacity: expandAnim }}
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

  // Desktop/Web Drawer Mode
  if (shouldUseDrawerMode) {
    return (
      <Animated.View
        className="h-full relative overflow-hidden"
        style={{
          width: widthAnim,
          backgroundColor: theme.colors.surface,
        }}
      >
        <View
          className="absolute right-0 top-0 bottom-0 w-[1px] opacity-10 z-10"
          style={{ backgroundColor: theme.colors.onSurface }}
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

  // Mobile Modal Mode
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
      statusBarTranslucent
    >
      <View className="flex-1 absolute inset-0 z-50">
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="absolute inset-0"
        >
          <Animated.View
            className="absolute inset-0"
            style={{
              backgroundColor: theme.colors.backdrop, // Use Paper's backdrop color if available, or fallback
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1] // Backdrop usually handles its own opacity
              })
            }}
          >
             {/* Fallback overlay if backdrop is transparent or undefined */}
            <View className="absolute inset-0 bg-black/60" /> 
          </Animated.View>
        </TouchableOpacity>

        <Animated.View
          className="absolute left-0 bottom-0 top-0 shadow-xl elevation-16"
          style={{
            width: SIDEBAR_WIDTH,
            transform: [{ translateX: slideAnim }],
            backgroundColor: theme.colors.surface, // Formalized: Mobile sidebar uses standard Surface
          }}
        >
          <View
            className="absolute right-0 top-0 bottom-0 w-[1px] opacity-10 z-10"
            style={{ backgroundColor: theme.colors.outline }}
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