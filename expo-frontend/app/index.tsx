import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LivePrice from './components/LivePrice';
import { Symbol, WSTradeData } from './types/live-price.types';

export default function Index() {
  const [assets, setAssets] = useState<WSTradeData[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [selectedAsset, setSelectedAsset] = useState<Symbol>(Symbol.BTCUSDT);


  useEffect(() => {
    setIsClient(true)
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let socket: WebSocket | null = null;

    try {
      // Use the same IP as your API service
      socket = new WebSocket("ws://192.168.1.158:8084");
      console.log('Attempting WebSocket connection...');

      socket.onopen = () => {
        console.log('Connected to WebSocket backend');
        setConnectionStatus('connected');
      }

      socket.onmessage = (event) => {

        const response = JSON.parse(event.data)

        // Extract the trade data from the response
        const newTradeData: WSTradeData = response.price_updates;
        
        // Validate the data before updating
        if (newTradeData && newTradeData.symbol) {
          setAssets(prevAssets => {
            // Filter out any undefined items from previous state
            const validPrevAssets = prevAssets.filter(item => item && item.symbol);
            
            const existingIndex = validPrevAssets.findIndex(
              trade => trade.symbol === newTradeData.symbol
            );

            if (existingIndex !== -1) {
              // Update existing asset
              const updatedAssets = [...validPrevAssets];
              updatedAssets[existingIndex] = newTradeData;
              return updatedAssets;
            } else {
              // Add new asset
              return [...validPrevAssets, newTradeData];
            }
          });
        }
      }
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      }

      socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setConnectionStatus('disconnected');
      }

    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionStatus('error');
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isClient]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <SafeAreaView />
      <LivePrice data={assets} />
      {/* <CandlestickChart symbol="SOLUSDT" interval="1m" /> */}
      {/* <LiveCandlestickChart/> */}
    </View>
  );
}