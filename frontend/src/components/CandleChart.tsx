"use client";
import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, CandlestickData, CandlestickSeries, ISeriesApi } from "lightweight-charts";
import dynamic from 'next/dynamic';

const API_URL = "http://localhost:8003";

interface CandleApiResponse {
    success: boolean,
    data: CandlestickData[]
}

interface CandleChartProps {
    symbol: string;
    interval: string;
}

const CandleChart: React.FC<CandleChartProps> = ({ symbol, interval }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const [candleData, setCandleData] = useState<CandlestickData[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Set client-side flag to prevent hydration mismatch
        setIsClient(true);
    }, []);

    useEffect(() => {
        // Only run on client side
        if (!isClient) return;

        const fetchAndUpdateData = async () => {
            const result: CandleApiResponse = await fetchCandleData();
            if (result && result.data && result.data.length > 0) {
                setCandleData(result.data);
            }
        };

        // Initial fetch
        fetchAndUpdateData();

    }, [isClient, symbol, interval]);

    const fetchCandleData = async (): Promise<CandleApiResponse> => {
        try {
            console.log(`${API_URL}/candles/${symbol}USDT?interval=${interval}`)
            const response = await fetch(`${API_URL}/candles/${symbol}USDT?interval=${interval}`);
            const json = await response.json();

            console.log('json', json.data.data)
            
            // Validate and transform the data
            const validatedData = json.data.data.map((candle: any) => ({
                time: Math.floor(candle.time / 1000),
                open: parseFloat(candle.open),
                high: parseFloat(candle.high),
                low: parseFloat(candle.low),
                close: parseFloat(candle.close),
            })).filter((candle: any) => 
                !isNaN(candle.time) && 
                !isNaN(candle.open) && 
                !isNaN(candle.high) && 
                !isNaN(candle.low) && 
                !isNaN(candle.close)
            );

            console.log(validatedData[0])
            
            console.log('Validated data:', validatedData);
            
            return {
                success: true,
                data: validatedData,
            };
        } catch (error) {
            console.error('Error fetching candle data:', error);
            return {
                success: false,
                data: [],
            };
        }
    };

    useEffect(() => {
        // Only create chart on client side
        if (!isClient || !chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: {
                background: { type: ColorType.Solid, color: "#0f1621" },
                textColor: "#c7d1da",
            },
            grid: {
                vertLines: { color: "#1a2430" },
                horzLines: { color: "#1a2430" },
            },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries,{
            upColor: "#2fbf71",
            downColor: "#e35d6a",
            borderVisible: false,
            wickUpColor: "#2fbf71",
            wickDownColor: "#e35d6a",
        });

        // Store the series reference
        candleSeriesRef.current = candlestickSeries;

        chart.timeScale().fitContent();

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth || 0 });
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
            candleSeriesRef.current = null;
        };
    }, [isClient]); // Add isClient dependency

    // Update series when candleData changes
    useEffect(() => {
        if (candleSeriesRef.current && candleData.length > 0) {
            try {
                candleSeriesRef.current.setData(candleData);
                console.log('Successfully set chart data:', candleData);
            } catch (error) {
                console.error('Error setting chart data:', error);
                console.log('Problematic data:', candleData);
            }
        }
    }, [candleData]);

    return (
        <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }}>
            {!isClient && (
                <div 
                    style={{ 
                        width: "100%", 
                        height: "400px", 
                        backgroundColor: "#0f1621", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        color: "#c7d1da"
                    }}
                >
                    Loading chart...
                </div>
            )}
        </div>
    );
};

// Export with dynamic import to disable SSR
export default dynamic(() => Promise.resolve(CandleChart), {
    ssr: false,
    loading: () => (
        <div 
            style={{ 
                width: "100%", 
                height: "400px", 
                backgroundColor: "#0f1621", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "#c7d1da"
            }}
        >
            Loading chart...
        </div>
    )
});