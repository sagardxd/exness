import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {

  const [loaded, error] = useFonts({
    'ManropeRegular': require('@/assets/fonts/manrope/Manrope-Regular.ttf'),
    'ManropeMedium': require('@/assets/fonts/manrope/Manrope-Medium.ttf'),
    'ManropeBold': require('@/assets/fonts/manrope/Manrope-Bold.ttf'),
    'ManropeSemiBold': require('@/assets/fonts/manrope/Manrope-SemiBold.ttf'),
    'ManropeExtraBold': require('@/assets/fonts/manrope/Manrope-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
