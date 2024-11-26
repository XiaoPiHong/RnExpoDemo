/** 该文件可看作App.tsx */
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import ReduxProvider from "@/store";
import ThemeProvider from "@/context/useThemeContext";
import { Slot } from "expo-router";
import Toast from "react-native-toast-message";
import "@/i18n";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <ThemeProvider>
          <Slot />
          <Toast />
        </ThemeProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
