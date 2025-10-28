import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, Text, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const containerStyles: ViewStyle = {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
      };

      const iconContainerStyles: ViewStyle = {
        marginBottom: 16,
      };

      const titleStyles: TextStyle = {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center',
      };

      const messageStyles: TextStyle = {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
      };

      const buttonStyles: ViewStyle = {
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
      };

      const buttonTextStyles: TextStyle = {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      };

      return (
        <View style={containerStyles}>
          <View style={iconContainerStyles}>
            <Icon name="alert-circle-outline" size={64} color="#EF4444" />
          </View>
          <Text style={titleStyles}>Something went wrong</Text>
          <Text style={messageStyles}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            style={buttonStyles}
            onPress={this.handleReset}
            activeOpacity={0.7}>
            <Text style={buttonTextStyles}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
