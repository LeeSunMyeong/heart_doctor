import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SubscriptionPlansScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Subscription Plans Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default SubscriptionPlansScreen;
