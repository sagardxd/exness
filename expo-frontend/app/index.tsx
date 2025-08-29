import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CandlestickChart } from './components/CandlestickChart';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <SafeAreaView />
      <CandlestickChart symbol="SOLUSDT" interval="1m" />
    </View>
  );
}