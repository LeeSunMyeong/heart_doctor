import React from 'react';
import {View, ActivityIndicator, Text, ViewStyle, TextStyle} from 'react-native';

export type LoadingSpinnerSize = 'small' | 'large';

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  color?: string;
  message?: string;
  fullScreen?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#3B82F6',
  message,
  fullScreen = false,
  containerStyle,
  textStyle,
}) => {
  const containerStyles: ViewStyle = fullScreen
    ? {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }
    : {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      };

  const messageStyles: TextStyle = {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  };

  return (
    <View style={[containerStyles, containerStyle]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={[messageStyles, textStyle]}>{message}</Text>}
    </View>
  );
};
