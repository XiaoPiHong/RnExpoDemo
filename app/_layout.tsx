/** as App.tsx */
import "@/i18n";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import ReduxProvider from "@/store";
import ThemeProvider from "@/context/useThemeContext";
import { Slot } from "expo-router";
import Toast from "react-native-toast-message";
import NoInternet, { NoInternetToast } from "@/components/NoInternet";
import UpdateCheck from "@/components/UpdateCheck";
import * as Updates from "expo-updates";
import Constants from "expo-constants";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  async function onFetchUpdateAsync() {
    // 独立运行时（你通过 expo build 或 eas build 构建了独立应用（APK 或 IPA）、用户从应用商店或直接安装包安装并运行应用）才检查更新
    if (Constants.executionEnvironment === "standalone") {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        alert(`Error fetching latest Expo update: ${error}`);
      }
    }
  }

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    onFetchUpdateAsync();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <ThemeProvider>
          <Slot />
          <NoInternet />
          <Toast />
          <UpdateCheck />
        </ThemeProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
