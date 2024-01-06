import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'mon': require('../assets/fonts/Montserrat-Regular.ttf'),
    'mon-sb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'mon-b': require('../assets/fonts/Montserrat-Bold.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <RootLayoutNav />
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const {isLoaded, isSignedIn} = useAuth();

  useEffect(() => {
    if(isLoaded && !isSignedIn) {
      router.push('/(modals)/login');
    }  
  }, [isLoaded]);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#FDFFFF",
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="(modals)/login"
        options={{
          headerTitle: "Clerk Auth App",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="(modals)/signup"
        options={{
          headerTitle: "Create Account",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="(modals)/reset"
        options={{
          headerTitle: "Reset Password",
        }}
      ></Stack.Screen>
    </Stack>
  );
}