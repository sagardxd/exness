"use client"
import CandleChart from '@/components/CandleChart'
import { Symbol, WSResponse, WSTradeData } from '@/types/ws-stream.types'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [assets, setAssets] = useState<WSTradeData[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>(Symbol.BTCUSDT);
  const [selectedInterval, setSelectedInterval] = useState<string>("1m");
  const [isClient, setIsClient] = useState(false);

  // Helper function to format price based on decimals
  const formatPrice = (price: number, decimals: number) => {
    const formattedPrice = price / Math.pow(10, decimals);
    return formattedPrice.toFixed(decimals);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // connect to your backend WebSocket server
    const socket = new WebSocket("ws://localhost:8084/");

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      console.log(event.data)
      try {
        const response = JSON.parse(event.data);
        
        // Extract the trade data from the response
        const newTradeData: WSTradeData = response.price_updates;

        // Validate that we have the required data
        if (!newTradeData || !newTradeData.symbol || !newTradeData.buyPrice || !newTradeData.sellPrice) {
          console.warn("Invalid trade data received:", newTradeData);
          return;
        }

        setAssets(prevAssets => {
          const existingIndex = prevAssets.findIndex(
            trade => trade?.symbol === newTradeData.symbol
          );

          if (existingIndex !== -1) {
            // Update existing asset
            const updatedAssets = [...prevAssets];
            updatedAssets[existingIndex] = newTradeData;
            return updatedAssets;
          } else {
            // Add new asset
            return [...prevAssets, newTradeData];
          }
        });
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("❌ Disconnected from WebSocket server");
    };

    socket.onerror = (error) => {
      console.error("⚠️ WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [isClient]);

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className='p-4 flex bg-gray-900 text-white min-h-screen'>
        <div className='w-full flex items-center justify-center'>
          <div className='text-gray-400'>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 flex bg-[#0b0f14] text-gray-200 min-h-screen'>
      {/* Left Section: Live Prices */}
      <div className='w-1/5 p-4 border-r border-[#1a2430]'>
        <h2 className='text-lg font-semibold mb-4 text-gray-300 tracking-wide'>Live Prices</h2>
        <div className='space-y-2'>
          {assets.length > 0 ? (
            assets
              .filter(asset => asset && asset.symbol)
              .map((asset, index) => (
                <div key={asset.symbol || index} className='text-sm p-3 rounded bg-[#0f1621] border border-transparent hover:border-[#1f2a37] transition-colors'>
                  <div className='font-medium text-[#8ab4f8] mb-1 tracking-wide'>{asset.symbol}</div>
                  <div className='text-emerald-400'>
                    Buy: ${formatPrice(asset.buyPrice, asset.decimals)}
                  </div>
                  <div className='text-rose-400'>
                    Sell: ${formatPrice(asset.sellPrice, asset.decimals)}
                  </div>
                </div>
              ))
          ) : (
            <p className='text-gray-500'>Waiting for price data...</p>
          )}
        </div>
      </div>

      {/* Middle Section: Candlestick Chart and Controls */}
      <div className='w-3/5 p-4'>
        <div className="flex justify-center mb-4 gap-2">
          {Object.values(Symbol).map((sym) => (
            <button
              key={sym}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border ${selectedSymbol === sym ? "bg-[#1a2633] border-[#2a3a4d] text-gray-100" : "bg-[#0f1621] border-[#161f2a] text-gray-300 hover:bg-[#14202c]"}`}
              onClick={() => setSelectedSymbol(sym)}
            >
              {sym}
            </button>
          ))}
        </div>
        <div className="flex justify-center mb-5 gap-2">
          {["1m", "5m", "10m", "15m", "30m"].map((intervalOption) => (
            <button
              key={intervalOption}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors duration-200 border ${selectedInterval === intervalOption ? "bg-[#1a2633] border-[#2a3a4d] text-gray-100" : "bg-[#0f1621] border-[#161f2a] text-gray-300 hover:bg-[#14202c]"}`}
              onClick={() => setSelectedInterval(intervalOption)}
            >
              {intervalOption}
            </button>
          ))}
        </div>
        <div className='rounded-lg border border-[#162230] bg-[#0f1621] p-2'>
          <CandleChart symbol={selectedSymbol} interval={selectedInterval} />
        </div>
      </div>

      {/* Right Section: Buy/Sell Buttons */}
      <div className='w-1/5 p-4 border-l border-[#1a2430] flex flex-col items-center justify-center space-y-4'>
        <h2 className='text-lg font-semibold mb-2 text-gray-300 tracking-wide'>Trade</h2>

        {assets.length > 0 && (
          <div className='w-full mb-2 p-3 rounded-lg bg-[#0f1621] border border-[#161f2a]'>
            <div className='text-center text-xs text-gray-400 mb-2'>Selected: {selectedSymbol}</div>
            {(() => {
              const selectedAsset = assets.find(asset => asset?.symbol === selectedSymbol);
              if (selectedAsset) {
                return (
                  <div className='text-center'>
                    <div className='text-emerald-400 text-sm'>
                      Buy: ${formatPrice(selectedAsset.buyPrice, selectedAsset.decimals)}
                    </div>
                    <div className='text-rose-400 text-sm'>
                      Sell: ${formatPrice(selectedAsset.sellPrice, selectedAsset.decimals)}
                    </div>
                  </div>
                );
              }
              return <div className='text-gray-500 text-sm text-center'>No data available</div>;
            })()}
          </div>
        )}

        <button className='w-full py-3 rounded-md font-semibold transition-colors duration-200 bg-emerald-600 text-white hover:bg-emerald-500'>
          Buy
        </button>
        <button className='w-full py-3 rounded-md font-semibold transition-colors duration-200 bg-rose-600 text-white hover:bg-rose-500'>
          Sell
        </button>
      </div>
    </div>
  )
}

export default Home