"use client"
import CandleChart from '@/components/CandleChart'
import Header from '@/components/Header'
import PricesList from '@/components/PricesList'
import TradeForm from '@/components/TradeForm'
import { Symbol, WSTradeData } from '@/types/ws-stream.types'
import React, { useEffect, useMemo, useState } from 'react'

const Home = () => {
  const [assets, setAssets] = useState<WSTradeData[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>(Symbol.BTCUSDT);
  const [selectedInterval, setSelectedInterval] = useState<string>("1m");
  const [isClient, setIsClient] = useState(false);
  const [balance, setBalance] = useState(5000)

  // Helper function to format price based on decimals
  const formatPrice = (price: number, decimals: number) => {
    const formattedPrice = price / Math.pow(10, decimals);
    return formattedPrice.toFixed(decimals);
  };

  const makeFormatter = (decimals: number) => (raw: number) => {
    return `$${formatPrice(raw, decimals)}`
  }

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
    <div className='min-h-screen flex flex-col '>
      <Header />
      <div className='p- flex bg-[#0b0f14]  text-gray-200 '>
        {/* Left Section: Live Prices */}
        <div className='w-1/5 p-2 border-b-4 border-[#1a2430]'>
          <h2 className='text-lg font-semibold mb-4 text-gray-300 tracking-wide'>Live Prices</h2>
          <PricesList
            assets={assets}
            makeFormatter={makeFormatter}
            onSelectSymbol={setSelectedSymbol}
            selectedSymbol={selectedSymbol}
          />
        </div>

        {/* Middle Section: Candlestick Chart and Controls */}
        <div className='w-3/5 p-4 border-[#1a2430] border-l-4 border-r-4 border-b-4'>
          <div className='flex items-center justify-between'>
            <div className="flex mb-4 gap-2">
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
            <div className="flex mb-5 gap-2">
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
          </div>
          <div className='rounded-lg border border-[#162230] p-2'>
            <CandleChart symbol={selectedSymbol} interval={selectedInterval} />
          </div>
        </div>

        {/* Right Section: Buy/Sell Buttons */}
        <TradeForm
              asset={selectedSymbol}      
              balance={balance}
              buyprice={1212}
              sellprice={1212}
        />
      </div>

    </div>
  )
}

export default Home