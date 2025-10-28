import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';

// Import stack navigators for each tab
import HomeStackNavigator from './stacks/HomeStackNavigator';
import HealthStackNavigator from './stacks/HealthStackNavigator';
import SubscriptionStackNavigator from './stacks/SubscriptionStackNavigator';
import ProfileStackNavigator from './stacks/ProfileStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthStackNavigator}
        options={{
          tabBarLabel: '건강',
        }}
      />
      <Tab.Screen
        name="Subscription"
        component={SubscriptionStackNavigator}
        options={{
          tabBarLabel: '구독',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: '프로필',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
