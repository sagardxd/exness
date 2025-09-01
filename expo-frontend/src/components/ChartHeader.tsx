import { formatPrice } from '@/src/utils/chartUtils';
import React from 'react';
import { Text, View } from 'react-native';

interface ChartHeaderProps {
  symbol: string;
  currentPrice: number;
  error?: string | null;
  loading?: boolean;
  onRefresh: () => void;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  symbol,
  currentPrice,
  error,
  loading = false,
  onRefresh,
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
        <Text style={{
          color: '#10B981',
          fontSize: 12,
        }}>
          ${formatPrice(currentPrice)}
        </Text>
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
      
      {/* <TouchableOpacity
        onPress={onRefresh}
        style={{
          backgroundColor: '#333',
          padding: 8,
          borderRadius: 4,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12 }}>
          {loading ? 'Loading...' : 'Refresh'}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}; 

export default ChartHeader;