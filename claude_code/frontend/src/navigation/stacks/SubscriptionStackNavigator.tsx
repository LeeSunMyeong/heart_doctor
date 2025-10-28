import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

// Import screens (placeholders for now)
import SubscriptionScreen from '../../components/screens/SubscriptionScreen';
import SubscriptionPlansScreen from '../../components/screens/SubscriptionPlansScreen';
import PaymentScreen from '../../components/screens/PaymentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const SubscriptionStackNavigator = () => {
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
        name="Subscription"
        component={SubscriptionScreen}
        options={{ title: '구독' }}
      />
      <Stack.Screen
        name="SubscriptionPlans"
        component={SubscriptionPlansScreen}
        options={{ title: '요금제' }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: '결제' }}
      />
    </Stack.Navigator>
  );
};

export default SubscriptionStackNavigator;
