import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

// Import screens
import { HomeScreen } from '../../screens/main/HomeScreen';
import CheckTestScreen from '../../components/screens/CheckTestScreen';
import CheckResultScreen from '../../components/screens/CheckResultScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeStackNavigator = () => {
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
        name="Home"
        component={HomeScreen}
        options={{ title: '홈' }}
      />
      <Stack.Screen
        name="CheckTest"
        component={CheckTestScreen}
        options={{ title: '심장 검사' }}
      />
      <Stack.Screen
        name="CheckResult"
        component={CheckResultScreen}
        options={{ title: '검사 결과' }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
