import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { WSTradeData } from '../types/live-price.types';
import AssetPrice from './AssetPrice';

interface LivePriceProps {
    data: WSTradeData[] | null
}

const LivePrice: React.FC<LivePriceProps> = ({ data }) => {
    const symbols = ["BTCUSDT", "SOLUSDT", "ETHUSDT"];

    const getPriceForSymbol = (symbol: string): WSTradeData | null => {
        if (!data || !Array.isArray(data)) return null;
        return data.find(item => item?.symbol === symbol) || null;
    };

    return (
        <ScrollView horizontal contentContainerStyle={styles.container}>
                {symbols.map((symbol) => {
                    const priceData = getPriceForSymbol(symbol);
                    
                    return <AssetPrice key={priceData?.symbol} priceData={priceData} />
                })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#1a1a1a',
        gap: 10
    },
    title: {
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default LivePrice;