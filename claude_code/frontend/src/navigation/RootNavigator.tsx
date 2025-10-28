import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { colors } from '../styles';

// Import navigators
import AuthNavigator from './AuthNavigator';

// Import screens
import { HomeScreen } from '../screens/main/HomeScreen';
import { ResultScreen } from '../screens/main/ResultScreen';
import { HistoryScreen } from '../screens/main/HistoryScreen';
import NotificationsScreen from '../components/screens/NotificationsScreen';
import SettingsScreen from '../components/screens/SettingsScreen';
import { PricingScreen } from '../screens/subscription/PricingScreen';
import { PaymentScreen } from '../screens/subscription/PaymentScreen';
import { PaymentHistoryScreen } from '../screens/subscription/PaymentHistoryScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const initAuth = async () => {
      await checkAuthStatus();
      setIsCheckingAuth(false);
    };
    initAuth();
  }, [checkAuthStatus]);

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        // Show Auth Navigator (Login, Signup, etc.) when not authenticated
        <AuthNavigator />
      ) : (
        // Show Main App Navigator when authenticated
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Main home screen */}
          <Stack.Screen name="Home" component={HomeScreen} />

          {/* Modal/Overlay screens accessible from anywhere */}
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="Pricing"
            component={PricingScreen}
            options={{
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="PaymentHistory"
            component={PaymentHistoryScreen}
            options={{
              animation: 'slide_from_right'
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default RootNavigator;
