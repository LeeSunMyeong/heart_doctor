import React from 'react';
import {TouchableOpacity, Text, ViewStyle, TextStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

export interface BackButtonProps {
  onPress?: () => void;
  label?: string;
  iconColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  label,
  iconColor = '#3B82F6',
  textColor = '#3B82F6',
  style,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const buttonStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  };

  const labelStyles: TextStyle = {
    fontSize: 16,
    color: textColor,
    marginLeft: 4,
  };

  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      onPress={handlePress}
      activeOpacity={0.7}>
      <Icon name="chevron-back" size={24} color={iconColor} />
      {label && <Text style={labelStyles}>{label}</Text>}
    </TouchableOpacity>
  );
};
