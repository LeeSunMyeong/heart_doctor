import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

// Import screens
import ProfileScreen from '../../screens/profile/ProfileScreen';
import { SettingsScreen } from '../../screens/settings/SettingsScreen';
import NotificationsScreen from '../../screens/profile/NotificationsScreen';
import NotificationDetailScreen from '../../screens/profile/NotificationDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: '프로필' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: '설정' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: '알림' }}
      />
      <Stack.Screen
        name="NotificationDetail"
        component={NotificationDetailScreen}
        options={{ title: '알림 상세' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
