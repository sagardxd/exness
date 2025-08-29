import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong',
  onRetry,
  retryText = 'Retry',
}) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#111',
    }}>
      <Text style={{ color: '#EF4444', fontSize: 16, textAlign: 'center' }}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            backgroundColor: '#333',
            padding: 12,
            borderRadius: 6,
            marginTop: 16,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 14 }}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}; 

export default ErrorState;