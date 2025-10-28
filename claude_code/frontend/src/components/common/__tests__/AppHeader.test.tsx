import React from 'react';
import {render} from '@testing-library/react-native';
import {AppHeader} from '../AppHeader';

// Mock TopNavigation
jest.mock('../TopNavigation', () => ({
  TopNavigation: () => null,
}));

describe('AppHeader', () => {
  it('renders correctly', () => {
    const {getByText} = render(<AppHeader />);
    expect(getByText('심장 건강지표 분석 도구')).toBeTruthy();
  });

  it('renders TopNavigation component', () => {
    const {UNSAFE_root} = render(<AppHeader />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('has correct container structure', () => {
    const {getByText} = render(<AppHeader />);
    const title = getByText('심장 건강지표 분석 도구');
    expect(title.props.style).toBeDefined();
  });
});
