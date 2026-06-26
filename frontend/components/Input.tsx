import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Colors, Radius, Typography } from '../constants/tokens';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  rightIcon,
  onRightIconPress,
  value,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    isFloating.value = withTiming(isFocused || value ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [isFocused, value]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: 18 - (isFloating.value * 8),
      fontSize: 15 - (isFloating.value * 3),
      color: error ? Colors.error : isFocused ? Colors.primary : Colors.gray500,
    };
  });

  const getBorderColor = () => {
    if (error) return Colors.error;
    if (isFocused) return Colors.primary;
    return Colors.gray300;
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { borderColor: getBorderColor() }]}>
        <Animated.Text style={[styles.label, labelAnimatedStyle]}>
          {label}
        </Animated.Text>
        <TextInput
          style={[styles.input, { marginTop: (isFocused || value) ? 12 : 0 }]}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="transparent"
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    height: 56,
    backgroundColor: Colors.gray100,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 16,
    fontFamily: 'GeneralSans-Regular',
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'GeneralSans-Regular',
    fontSize: 15,
    color: Colors.black,
    paddingRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  errorText: {
    ...Typography.small as any,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});
