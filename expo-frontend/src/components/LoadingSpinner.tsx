import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = '',
  size = 'large',
  color = '#10B981',
}) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#111',
    }}>
      <ActivityIndicator size={size} color={color} />
      <Text style={{ color: '#fff', marginTop: 10 }}>{message}</Text>
    </View>
  );
}; 

export default LoadingSpinner;