"use client"
import CandleChart from '@/components/CandleChart'
import React, { useEffect, useState } from 'react'

const Home = () => {

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // connect to your backend WebSocket server
    const socket = new WebSocket("ws://127.0.0.1:8084/");

    socket.onmessage = (event) => {
      console.log("📩 Message from server:", event.data);
      // update state so UI shows messages
      setMessages((prev) => [...prev, event.data]);
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
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Demo Candlestick</h1>
      <CandleChart />
    </div>
  )
}

export default Home
