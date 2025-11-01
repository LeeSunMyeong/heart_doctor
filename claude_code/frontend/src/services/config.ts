import { Platform } from 'react-native';

export const getBaseUrl = (): string => {
  // Android 에뮬레이터는 10.0.2.2를 사용하여 호스트 머신의 localhost에 접근
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  // iOS: 시뮬레이터는 localhost, 실제 기기는 Mac의 로컬 IP 주소 사용
  // TODO: 실제 기기 테스트 시 아래 IP 주소를 본인의 Mac IP로 변경 필요
  // Mac IP 확인: 시스템 설정 > 네트워크 > Wi-Fi > 상세 정보
  return 'http://localhost:8080';
};
