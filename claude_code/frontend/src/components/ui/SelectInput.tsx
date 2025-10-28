import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectInputProps {
  label?: string;
  value: string | number | null;
  options: SelectOption[];
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  containerStyle,
  labelStyle,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string | number) => {
    onValueChange(optionValue);
    setIsModalVisible(false);
  };

  const containerStyles: ViewStyle = {
    marginBottom: 16,
  };

  const labelStyles: TextStyle = {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  };

  const selectButtonStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: error ? '#EF4444' : '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: disabled ? '#F3F4F6' : '#FFFFFF',
  };

  const selectTextStyles: TextStyle = {
    fontSize: 16,
    color: selectedOption ? '#1F2937' : '#9CA3AF',
    flex: 1,
  };

  const errorStyles: TextStyle = {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  };

  const modalOverlayStyles: ViewStyle = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  };

  const modalContentStyles: ViewStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: 400,
  };

  const modalHeaderStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  };

  const modalTitleStyles: TextStyle = {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  };

  const optionItemStyles: ViewStyle = {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  };

  const optionTextStyles: TextStyle = {
    fontSize: 16,
    color: '#1F2937',
  };

  const selectedOptionStyles: ViewStyle = {
    backgroundColor: '#EFF6FF',
  };

  return (
    <View style={[containerStyles, containerStyle]}>
      {label && (
        <Text style={[labelStyles, labelStyle]}>
          {label}
          {required && <Text style={{color: '#EF4444'}}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={selectButtonStyles}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}>
        <Text style={selectTextStyles}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon
          name="chevron-down"
          size={20}
          color={disabled ? '#9CA3AF' : '#6B7280'}
        />
      </TouchableOpacity>

      {error && <Text style={errorStyles}>{error}</Text>}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}>
        <TouchableOpacity
          style={modalOverlayStyles}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={modalContentStyles}
            onPress={e => e.stopPropagation()}>
            <View style={modalHeaderStyles}>
              <Text style={modalTitleStyles}>
                {label || 'Select an option'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                activeOpacity={0.7}>
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={item => String(item.value)}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    optionItemStyles,
                    value === item.value && selectedOptionStyles,
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}>
                  <Text style={optionTextStyles}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
