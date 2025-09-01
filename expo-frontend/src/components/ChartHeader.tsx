import React from 'react';
import { Text, View } from 'react-native';

interface ChartHeaderProps {
  symbol: string;
  currentPrice: number;
  error?: string | null;
  loading?: boolean;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  symbol,
  currentPrice,
  error,
  loading = false,
}) => {
  return (
    <View style={{
      position: 'absolute',
      top: 5,
      left: 15,
      right: 15,
      zIndex: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <View>
        <Text style={{
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
        }}>
          {symbol}
        </Text>
        {/* <Text style={{
          color: '#10B981',
          fontSize: 12,
        }}>
          ${formatPrice(currentPrice)}
        </Text> */}
        {error && (
          <Text style={{
            color: '#EF4444',
            fontSize: 10,
            marginTop: 2,
          }}>
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}; 

export default ChartHeader;