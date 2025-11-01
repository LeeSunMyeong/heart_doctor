import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './src/i18n'; // Initialize i18n
import RootNavigator from './src/navigation/RootNavigator';
import { useAuthStore } from './src/store/authStore';
import { configureGoogleSignIn } from './src/services/googleAuthService';
// import './global.css'; // Temporarily disabled

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    // Initialize Google Sign-In on app startup (required for iOS)
    console.log('[App] Initializing Google Sign-In...');
    configureGoogleSignIn();

    // Check authentication status on app startup
    checkAuthStatus();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
