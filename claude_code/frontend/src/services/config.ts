import { Platform } from 'react-native';

export const getBaseUrl = (): string => {
  // Android 에뮬레이터는 10.0.2.2를 사용하여 호스트 머신의 localhost에 접근
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  // iOS 시뮬레이터는 localhost를 직접 사용
  return 'http://localhost:8080';
};
