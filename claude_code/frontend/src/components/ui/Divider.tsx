import React from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends ViewProps {
  orientation?: DividerOrientation;
  color?: string;
  thickness?: number;
  spacing?: number;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  color = '#E5E7EB',
  thickness = 1,
  spacing = 16,
  style,
  ...props
}) => {
  const dividerStyles: ViewStyle =
    orientation === 'horizontal'
      ? {
          height: thickness,
          backgroundColor: color,
          marginVertical: spacing,
          width: '100%',
        }
      : {
          width: thickness,
          backgroundColor: color,
          marginHorizontal: spacing,
          height: '100%',
        };

  return <View {...props} style={[dividerStyles, style]} />;
};
