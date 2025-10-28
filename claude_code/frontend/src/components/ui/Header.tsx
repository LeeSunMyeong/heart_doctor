import React from 'react';
import {View, Text, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  safe?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  onLeftPress,
  onRightPress,
  containerStyle,
  titleStyle,
  safe = true,
}) => {
  const headerContainerStyles: ViewStyle = {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  };

  const headerContentStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  };

  const leftActionStyles: ViewStyle = {
    width: 40,
    justifyContent: 'center',
  };

  const centerStyles: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  };

  const rightActionStyles: ViewStyle = {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  };

  const titleStyles: TextStyle = {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  };

  const subtitleStyles: TextStyle = {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  };

  const Wrapper = safe ? SafeAreaView : View;

  return (
    <Wrapper style={[headerContainerStyles, containerStyle]} edges={['top']}>
      <View style={headerContentStyles}>
        <View style={leftActionStyles}>
          {leftAction && onLeftPress ? (
            <TouchableOpacity onPress={onLeftPress} activeOpacity={0.7}>
              {leftAction}
            </TouchableOpacity>
          ) : (
            leftAction
          )}
        </View>

        <View style={centerStyles}>
          <Text style={[titleStyles, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && <Text style={subtitleStyles}>{subtitle}</Text>}
        </View>

        <View style={rightActionStyles}>
          {rightAction && onRightPress ? (
            <TouchableOpacity onPress={onRightPress} activeOpacity={0.7}>
              {rightAction}
            </TouchableOpacity>
          ) : (
            rightAction
          )}
        </View>
      </View>
    </Wrapper>
  );
};
