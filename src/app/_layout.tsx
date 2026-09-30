import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { CreatorProvider } from '@/context/creator-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CreatorProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#faf8ff' },
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="platforms" />
          <Stack.Screen name="results" />
          <Stack.Screen name="explore" options={{ presentation: 'modal' }} />
        </Stack>
      </CreatorProvider>
    </ThemeProvider>
  );
}
