import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {
  Button,
  IconButton,
  ToggleButton,
  TextInput,
  NumberInput,
  Card,
  Container,
  LoadingSpinner,
  FormSection,
  YesNoField,
  BMIDisplay,
} from '../../src/components/ui';

describe('Phase 2: UI Components', () => {
  describe('Button Components', () => {
    it('should render Button with text', () => {
      const {getByText} = render(<Button>Click Me</Button>);
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('should call onPress when Button is pressed', () => {
      const onPress = jest.fn();
      const {getByText} = render(<Button onPress={onPress}>Click Me</Button>);
      fireEvent.press(getByText('Click Me'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should render Button with different variants', () => {
      const {rerender, getByText} = render(
        <Button variant="primary">Primary</Button>,
      );
      expect(getByText('Primary')).toBeTruthy();

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(getByText('Secondary')).toBeTruthy();

      rerender(<Button variant="outline">Outline</Button>);
      expect(getByText('Outline')).toBeTruthy();
    });

    it('should render ToggleButton', () => {
      const onValueChange = jest.fn();
      const {getByText} = render(
        <ToggleButton value={true} onValueChange={onValueChange} />,
      );
      expect(getByText('Yes')).toBeTruthy();
      expect(getByText('No')).toBeTruthy();
    });

    it('should toggle ToggleButton value', () => {
      const onValueChange = jest.fn();
      const {getByText} = render(
        <ToggleButton value={false} onValueChange={onValueChange} />,
      );
      fireEvent.press(getByText('Yes'));
      expect(onValueChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Input Components', () => {
    it('should render TextInput with label', () => {
      const {getByText} = render(
        <TextInput label="Username" value="" onChangeText={() => {}} />,
      );
      expect(getByText('Username')).toBeTruthy();
    });

    it('should call onChangeText when TextInput text changes', () => {
      const onChangeText = jest.fn();
      const {getByPlaceholderText} = render(
        <TextInput
          placeholder="Enter text"
          value=""
          onChangeText={onChangeText}
        />,
      );
      fireEvent.changeText(getByPlaceholderText('Enter text'), 'Hello');
      expect(onChangeText).toHaveBeenCalledWith('Hello');
    });

    it('should render NumberInput with min/max hints', () => {
      const {getByText} = render(
        <NumberInput
          label="Age"
          value={null}
          onValueChange={() => {}}
          min={0}
          max={120}
        />,
      );
      expect(getByText(/Age/)).toBeTruthy();
      expect(getByText(/(0-120)/)).toBeTruthy();
    });

    it('should handle NumberInput value changes', () => {
      const onValueChange = jest.fn();
      const {getByDisplayValue} = render(
        <NumberInput value={25} onValueChange={onValueChange} />,
      );
      const input = getByDisplayValue('25');
      fireEvent.changeText(input, '30');
      expect(onValueChange).toHaveBeenCalledWith(30);
    });
  });

  describe('Layout Components', () => {
    it('should render Container with children', () => {
      const {getByText} = render(
        <Container>
          <></>
        </Container>,
      );
      // Container should render without errors
    });

    it('should render Card with children', () => {
      const {getByText} = render(
        <Card>
          <></>
        </Card>,
      );
      // Card should render without errors
    });

    it('should render Card with different variants', () => {
      const {rerender} = render(<Card variant="default"><></></Card>);
      rerender(<Card variant="elevated"><></></Card>);
      rerender(<Card variant="outlined"><></></Card>);
    });
  });

  describe('Feedback Components', () => {
    it('should render LoadingSpinner', () => {
      const {getByTestId} = render(<LoadingSpinner />);
      // LoadingSpinner should render ActivityIndicator
    });

    it('should render LoadingSpinner with message', () => {
      const {getByText} = render(<LoadingSpinner message="Loading..." />);
      expect(getByText('Loading...')).toBeTruthy();
    });
  });

  describe('Form Components', () => {
    it('should render FormSection with title', () => {
      const {getByText} = render(
        <FormSection title="Personal Information">
          <></>
        </FormSection>,
      );
      expect(getByText('Personal Information')).toBeTruthy();
    });

    it('should render FormSection with description', () => {
      const {getByText} = render(
        <FormSection title="Section" description="This is a description">
          <></>
        </FormSection>,
      );
      expect(getByText('This is a description')).toBeTruthy();
    });

    it('should render YesNoField', () => {
      const onValueChange = jest.fn();
      const {getByText} = render(
        <YesNoField
          label="Do you smoke?"
          value={null}
          onValueChange={onValueChange}
        />,
      );
      expect(getByText('Do you smoke?')).toBeTruthy();
      expect(getByText('Yes')).toBeTruthy();
      expect(getByText('No')).toBeTruthy();
    });

    it('should handle YesNoField value changes', () => {
      const onValueChange = jest.fn();
      const {getByText} = render(
        <YesNoField
          label="Question"
          value={false}
          onValueChange={onValueChange}
        />,
      );
      fireEvent.press(getByText('Yes'));
      expect(onValueChange).toHaveBeenCalledWith(true);
    });
  });

  describe('BMIDisplay Component', () => {
    it('should calculate and display BMI correctly', () => {
      const {getByText} = render(<BMIDisplay height={170} weight={70} />);
      // BMI = 70 / (1.7 * 1.7) = 24.2
      expect(getByText('24.2')).toBeTruthy();
    });

    it('should display correct BMI category for normal weight', () => {
      const {getByText} = render(<BMIDisplay height={170} weight={65} />);
      // BMI = 22.5 (normal)
      expect(getByText('정상')).toBeTruthy();
    });

    it('should display correct BMI category for overweight', () => {
      const {getByText} = render(<BMIDisplay height={170} weight={75} />);
      // BMI = 25.9 (overweight)
      expect(getByText('비만')).toBeTruthy();
    });

    it('should display height and weight', () => {
      const {getByText} = render(<BMIDisplay height={175} weight={68} />);
      expect(getByText('175 cm')).toBeTruthy();
      expect(getByText('68 kg')).toBeTruthy();
    });
  });
});
