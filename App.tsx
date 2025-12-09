import "./global.css";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { ThemeProvider, useTheme } from "./frontend/context/ThemeContext";
import { SidebarProvider } from "./frontend/context/SidebarContext";
import StackNavigator from "./frontend/navigator/StackNavigator";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { theme } = useTheme();
  return (
    <PaperProvider theme={theme}>
      <SidebarProvider>
        <StackNavigator />
      </SidebarProvider>
    </PaperProvider>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
