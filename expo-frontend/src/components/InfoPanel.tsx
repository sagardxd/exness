import { CandleData } from '@/src/types/candlestick';
import { formatPrice } from '@/src/utils/chartUtils';
import React from 'react';
import { Text, View } from 'react-native';

interface InfoPanelProps {
  data: CandleData[];
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ data }) => {
  const labels = ['Open', 'High', 'Low', 'Close'];
  const values = ['open', 'high', 'low', 'close'];
  const colors = ['#9CA3AF', '#10B981', '#EF4444', '#F3F4F6'];
  
  return (
    <View style={{
      position: 'absolute',
      bottom: 10,
      left: 15,
      backgroundColor: '#333',
      padding: 8,
      borderRadius: 4,
      flexDirection: 'row',
      gap: 12,
    }}>
      {labels.map((label, index) => {
        const value = data[data.length - 1]?.[values[index] as keyof CandleData] || 0;
        
        return (
          <View key={label}>
            <Text style={{ color: '#888', fontSize: 9 }}>{label}</Text>
            <Text style={{ color: colors[index], fontSize: 11 }}>
              {formatPrice(value as number)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}; 

export default InfoPanel;