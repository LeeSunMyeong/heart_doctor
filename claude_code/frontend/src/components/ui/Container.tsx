import React from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';

export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

export interface ContainerProps extends ViewProps {
  padding?: ContainerPadding;
  safe?: boolean;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  padding = 'md',
  safe = false,
  children,
  style,
  ...props
}) => {
  const getPaddingStyles = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return {padding: 0};
      case 'sm':
        return {padding: 12};
      case 'md':
        return {padding: 16};
      case 'lg':
        return {padding: 24};
      default:
        return {padding: 16};
    }
  };

  const containerStyles: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background.primary,
    ...getPaddingStyles(),
  };

  const WrapperComponent = safe ? SafeAreaView : View;

  return (
    <WrapperComponent {...props} style={[containerStyles, style]}>
      {children}
    </WrapperComponent>
  );
};
