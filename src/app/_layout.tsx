import {
  ZenMaruGothic_500Medium,
  ZenMaruGothic_700Bold,
  useFonts,
} from "@expo-google-fonts/zen-maru-gothic";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { theme } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ZenMaruGothic_500Medium,
    ZenMaruGothic_700Bold,
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
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "おうこくチェス" }} />
        <Stack.Screen
          name="two-player-game"
          options={{ title: "ふたりであそぶ" }}
        />
        <Stack.Screen
          name="choose-difficulty"
          options={{ title: "つよさをえらぶ" }}
        />
        <Stack.Screen
          name="single-player-game"
          options={{ title: "ひとりであそぶ" }}
        />
        <Stack.Screen name="how-to-play" options={{ title: "あそびかた" }} />
      </Stack>
    </>
  );
}
