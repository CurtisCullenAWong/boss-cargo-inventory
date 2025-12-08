import "./global.css";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { ThemeProvider, useTheme } from "./frontend/context/ThemeContext";
import StackNavigator from "./frontend/navigator/StackNavigator";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { theme } = useTheme();
  return (
    <PaperProvider theme={theme}>
      <StackNavigator />
    </PaperProvider>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Onest-Regular": require("./assets/fonts/Onest-Regular.ttf"),
    "Onest-Bold": require("./assets/fonts/Onest-Bold.ttf"),
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
