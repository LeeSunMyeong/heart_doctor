import React, {useState} from 'react';
import {
  View,
  TextInput as RNTextInput,
  TouchableOpacity,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export interface SearchInputProps extends RNTextInputProps {
  onClear?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onClear,
  containerStyle,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  const containerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isFocused ? '#3B82F6' : '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  };

  const inputTextStyles: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  };

  return (
    <View style={[containerStyles, containerStyle]}>
      <Icon name="search" size={20} color="#9CA3AF" />
      <RNTextInput
        {...props}
        style={[inputTextStyles, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        onFocus={e => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={e => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
      />
      {value && value.length > 0 && (
        <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
          <Icon name="close-circle" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};
