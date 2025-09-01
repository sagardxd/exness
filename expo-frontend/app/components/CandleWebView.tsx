import React, { useEffect, useRef } from "react";
import { WebView } from "react-native-webview";
import { WSTradeData } from "../types/live-price.types";

interface CandleWebViewProps {
  symbol?: string;
  data?: WSTradeData | null;
  height?: number;
}

export default function CandleWebView({ symbol = "BTC", data, height = 400 }: CandleWebViewProps) {
  const webViewRef = useRef<WebView>(null);

  // Generate HTML with dynamic data
  const generateHTML = (priceData: WSTradeData | null) => {
    const currentPrice = priceData?.buyPrice || 100000;
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Generate some sample candlestick data around the current price
    const sampleData = [];
    for (let i = 10; i >= 0; i--) {
      const time = timestamp - (i * 60); // 1 minute intervals
      const basePrice = currentPrice * (0.98 + Math.random() * 0.04); // ±2% variation
      const open = basePrice;
      const close = basePrice * (0.995 + Math.random() * 0.01);
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (0.995 + Math.random() * 0.005);
      
      sampleData.push({
        time,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2))
      });
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
          <style>
            html, body, #chart {
              margin: 0;
              padding: 0;
              height: 100%;
              background: #0f1621;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #chart {
              width: 100%;
              height: ${height}px;
            }
          </style>
        </head>
        <body>
          <div id="chart"></div>
          <script>
            const chart = LightweightCharts.createChart(document.getElementById("chart"), {
              width: document.getElementById("chart").clientWidth,
              height: ${height},
              layout: {
                background: { type: 'solid', color: '#0f1621' },
                textColor: '#c7d1da'
              },
              grid: {
                vertLines: { color: '#1a2430' },
                horzLines: { color: '#1a2430' }
              },
              crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal
              },
              rightPriceScale: {
                borderColor: '#1a2430',
                textColor: '#c7d1da'
              },
              timeScale: {
                borderColor: '#1a2430',
                textColor: '#c7d1da',
                timeVisible: true,
                secondsVisible: false
              }
            });

            const series = chart.addCandlestickSeries({
              upColor: "#2fbf71",
              downColor: "#e35d6a",
              borderUpColor: "#2fbf71",
              borderDownColor: "#e35d6a",
              wickUpColor: "#2fbf71",
              wickDownColor: "#e35d6a",
            });

            // Sample data
            const sampleData = ${JSON.stringify(sampleData)};
            series.setData(sampleData);
            
            // Fit content to show all data
            chart.timeScale().fitContent();

            // Handle window resize
            const handleResize = () => {
              chart.applyOptions({ 
                width: document.getElementById("chart").clientWidth 
              });
            };
            
            window.addEventListener('resize', handleResize);

            // Function to update chart data (can be called from React Native)
            window.updateChartData = function(newData) {
              if (newData && newData.length > 0) {
                series.setData(newData);
                chart.timeScale().fitContent();
              }
            };

            // Function to add new candle
            window.addNewCandle = function(candle) {
              series.update(candle);
            };
          </script>
        </body>
      </html>
    `;
  };

  // Update chart when data changes
  useEffect(() => {
    if (webViewRef.current && data) {
      const newCandle = {
        time: Math.floor(Date.now() / 1000),
        open: data.buyPrice,
        high: data.buyPrice * 1.001,
        low: data.buyPrice * 0.999,
        close: data.buyPrice
      };
      
      // Send new candle data to WebView
      webViewRef.current.postMessage(JSON.stringify({
        type: 'NEW_CANDLE',
        data: newCandle
      }));
    }
  }, [data]);

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ html: generateHTML(data || null) }}
      style={{ height }}
      onMessage={(event) => {
        // Handle messages from WebView if needed
        console.log('Message from WebView:', event.nativeEvent.data);
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={false}
      scalesPageToFit={true}
    />
  );
}
