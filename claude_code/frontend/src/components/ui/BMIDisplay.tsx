import React from 'react';
import {View, Text, ViewStyle, TextStyle} from 'react-native';
import {Card} from './Card';

export interface BMIDisplayProps {
  height: number;
  weight: number;
  containerStyle?: ViewStyle;
}

export const BMIDisplay: React.FC<BMIDisplayProps> = ({
  height,
  weight,
  containerStyle,
}) => {
  const calculateBMI = (): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return '저체중';
    if (bmi < 23) return '정상';
    if (bmi < 25) return '과체중';
    if (bmi < 30) return '비만';
    return '고도비만';
  };

  const getBMIColor = (bmi: number): string => {
    if (bmi < 18.5) return '#3B82F6'; // Blue for underweight
    if (bmi < 23) return '#22C55E'; // Green for normal
    if (bmi < 25) return '#F59E0B'; // Yellow for overweight
    if (bmi < 30) return '#EF4444'; // Red for obese
    return '#991B1B'; // Dark red for severely obese
  };

  const bmi = calculateBMI();
  const category = getBMICategory(bmi);
  const color = getBMIColor(bmi);

  const cardContentStyles: ViewStyle = {
    alignItems: 'center',
    padding: 16,
  };

  const labelStyles: TextStyle = {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  };

  const bmiValueStyles: TextStyle = {
    fontSize: 48,
    fontWeight: '700',
    color,
    marginBottom: 4,
  };

  const categoryStyles: TextStyle = {
    fontSize: 18,
    fontWeight: '600',
    color,
    marginBottom: 16,
  };

  const infoRowStyles: ViewStyle = {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  };

  const infoItemStyles: ViewStyle = {
    alignItems: 'center',
  };

  const infoLabelStyles: TextStyle = {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  };

  const infoValueStyles: TextStyle = {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  };

  const rangeStyles: TextStyle = {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  };

  return (
    <Card variant="elevated" style={containerStyle}>
      <View style={cardContentStyles}>
        <Text style={labelStyles}>체질량지수 (BMI)</Text>
        <Text style={bmiValueStyles}>{bmi.toFixed(1)}</Text>
        <Text style={categoryStyles}>{category}</Text>

        <View style={infoRowStyles}>
          <View style={infoItemStyles}>
            <Text style={infoLabelStyles}>신장</Text>
            <Text style={infoValueStyles}>{height} cm</Text>
          </View>
          <View style={infoItemStyles}>
            <Text style={infoLabelStyles}>체중</Text>
            <Text style={infoValueStyles}>{weight} kg</Text>
          </View>
        </View>

        <Text style={rangeStyles}>
          정상 범위: 18.5 - 23.0 | 현재: {bmi.toFixed(1)}
        </Text>
      </View>
    </Card>
  );
};
