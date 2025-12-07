import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "./frontend/context/ThemeContext";
import StackNavigator from "./frontend/navigator/StackNavigator";

function AppContent() {
  const { theme } = useTheme();
  return (
    <PaperProvider theme={theme}>
      <StackNavigator />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
