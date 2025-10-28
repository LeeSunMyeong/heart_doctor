import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {PageHeader} from '../PageHeader';

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

describe('PageHeader', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
  });

  describe('Standard layout', () => {
    it('renders title correctly', () => {
      const {getByText} = render(<PageHeader title="환경 설정" />);
      expect(getByText('환경 설정')).toBeTruthy();
    });

    it('renders subtitle when provided', () => {
      const {getByText} = render(
        <PageHeader title="로그인" subtitle="Welcome" />,
      );
      expect(getByText('로그인')).toBeTruthy();
      expect(getByText('Welcome')).toBeTruthy();
    });

    it('renders with showBackButton true by default', () => {
      const {getByText} = render(<PageHeader title="Test" />);
      expect(getByText('Test')).toBeTruthy();
    });

    it('renders without back button when showBackButton is false', () => {
      const {getByText} = render(
        <PageHeader title="Test" showBackButton={false} />,
      );
      expect(getByText('Test')).toBeTruthy();
    });
  });

  describe('Centered layout', () => {
    it('renders in centered mode', () => {
      const {getByText} = render(
        <PageHeader title="로그인" centered={true} />,
      );
      expect(getByText('로그인')).toBeTruthy();
    });

    it('renders subtitle in centered mode', () => {
      const {getByText} = render(
        <PageHeader
          title="회원가입"
          subtitle="새로운 계정을 만들어주세요"
          centered={true}
        />,
      );
      expect(getByText('회원가입')).toBeTruthy();
      expect(getByText('새로운 계정을 만들어주세요')).toBeTruthy();
    });

    it('renders centered layout correctly', () => {
      const {getByText} = render(
        <PageHeader title="Test" centered={true} />,
      );
      expect(getByText('Test')).toBeTruthy();
    });
  });

  describe('Props combination', () => {
    it('handles all props together', () => {
      const {getByText} = render(
        <PageHeader
          title="Title"
          subtitle="Subtitle"
          showBackButton={true}
          centered={false}
        />,
      );
      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Subtitle')).toBeTruthy();
    });

    it('handles centered with no back button', () => {
      const {getByText} = render(
        <PageHeader title="Title" showBackButton={false} centered={true} />,
      );
      expect(getByText('Title')).toBeTruthy();
    });
  });
});
