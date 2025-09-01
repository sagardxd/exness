import { formatPrice } from '@/src/utils/chartUtils';
import React from 'react';
import { Text, View } from 'react-native';

interface PriceLabelsProps {
  priceRange: { min: number; max: number };
  chartTop: number;
  chartHeight: number;
}

export const PriceLabels: React.FC<PriceLabelsProps> = ({
  priceRange,
  chartTop,
  chartHeight,
}) => {
  const labels = [];

  for (let i = 0; i <= 4; i++) {
    const price = priceRange.min + (priceRange.max - priceRange.min) * (1 - i / 4);
    const y = chartTop + (chartHeight / 4) * i;
    
    labels.push(
      <View
        key={i}
        style={{
          position: 'absolute',
          right: 10,
          top: y - 8,
          backgroundColor: '#333',
          paddingHorizontal: 4,
          paddingVertical: 1,
          borderRadius: 2,
          zIndex: 1000
        }}
      >
        <Text style={{ color: '#fff', fontSize: 10 }}>
          {formatPrice(price)}
        </Text>
      </View>
    );
  }
  
  return <>{labels}</>;
}; 

export default PriceLabels;