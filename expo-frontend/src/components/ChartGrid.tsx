import { Canvas, Path, Rect, Skia } from '@shopify/react-native-skia';
import React from 'react';

interface ChartGridProps {
  chartWidth: number;
  chartHeight: number;
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  chartWidth,
  chartHeight,
}) => {
  const createGrid = () => {
    const path = Skia.Path.Make();
    
    // Horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = (chartHeight / 4) * i;
      path.moveTo(0, y);
      path.lineTo(chartWidth, y);
    }
    
    // Vertical lines
    for (let i = 0; i < 10; i++) {
      const x = (chartWidth / 9) * i;
      path.moveTo(x, 0);
      path.lineTo(x, chartHeight);
    }
    
    return path;
  };

  return (
    <Canvas style={{ 
      position: 'absolute',
      width: chartWidth, 
      height: chartHeight 
    }}>
      <Path
        path={createGrid()}
        color="#333"
        style="stroke"
        strokeWidth={0.5}
      />
      <Rect
        x={0}
        y={0}
        width={chartWidth}
        height={chartHeight}
        color="transparent"
        style="stroke"
        strokeWidth={1}
      />
    </Canvas>
  );
}; 

export default ChartGrid;