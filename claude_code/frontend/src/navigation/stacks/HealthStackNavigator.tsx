import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

// Import screens
import HealthScreen from '../../screens/main/HealthScreen';
import HealthHistoryScreen from '../../screens/main/HealthHistoryScreen';
import HealthDetailScreen from '../../screens/main/HealthDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HealthStackNavigator = () => {
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
        name="Health"
        component={HealthScreen}
        options={{ title: '건강' }}
      />
      <Stack.Screen
        name="HealthHistory"
        component={HealthHistoryScreen}
        options={{ title: '검사 기록' }}
      />
      <Stack.Screen
        name="HealthDetail"
        component={HealthDetailScreen}
        options={{ title: '상세 정보' }}
      />
    </Stack.Navigator>
  );
};

export default HealthStackNavigator;
