import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ModalProps as RNModalProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export interface ModalProps extends Omit<RNModalProps, 'visible'> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  containerStyle,
  contentStyle,
  ...props
}) => {
  const overlayStyles: ViewStyle = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  };

  const modalContainerStyles: ViewStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  };

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  };

  const titleStyles: TextStyle = {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  };

  return (
    <RNModal
      {...props}
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={overlayStyles}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[modalContainerStyles, containerStyle]}
          onPress={e => e.stopPropagation()}>
          {(title || showCloseButton) && (
            <View style={headerStyles}>
              {title && <Text style={titleStyles}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                  <Icon name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={contentStyle}>{children}</View>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};
