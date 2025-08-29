"use client"
import React from "react"
import FlashPrice from "@/components/FlashPrice"
import { Symbol, WSTradeData } from "@/types/ws-stream.types"

type PricesListProps = {
  assets: WSTradeData[]
  makeFormatter: (decimals: number) => (value: number) => string
  onSelectSymbol?: (symbol: Symbol) => void
  selectedSymbol?: Symbol
}

const PricesList: React.FC<PricesListProps> = ({ assets, makeFormatter, onSelectSymbol, selectedSymbol }) => {
  if (!assets || assets.length === 0) {
    return <p className="text-gray-500">Waiting for price data...</p>
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid grid-cols-3 text-[10px] uppercase tracking-wider text-gray-400">
        <span>Asset</span>
        <span className="text-left">Ask</span>
        <span className="text-left">Bid</span>
      </div>

      {/* Rows */}
      {assets
        .filter(asset => asset && asset.symbol)
        .map((asset, index) => {
          const isSelected = selectedSymbol && asset.symbol === selectedSymbol
          return (
            <button
              key={asset.symbol || index}
              className={`grid grid-cols-3 w-full text-sm py-3  rounded bg-[#0f1621] border transition-colors 
                ${isSelected ? "border-[#2a3a4d]" : "border-transparent hover:border-[#1f2a37]"}`}
              onClick={() => onSelectSymbol && onSelectSymbol(asset.symbol)}
            >
              {/* Asset */}
              <div className="font-medium text-[#8ab4f8] flex items-center  text-left">
                {String(asset.symbol).replace("USDT", "")}
              </div>

              {/* Ask */}
              <div className="text-rose-400 text-left mx-1">
                <FlashPrice value={asset.sellPrice} format={makeFormatter(asset.decimals)} />
              </div>

              {/* Bid */}
              <div className="text-emerald-400 text-left mx-1">
                <FlashPrice value={asset.buyPrice} format={makeFormatter(asset.decimals)} />
              </div>
            </button>
          )
        })}
    </div>
  )
}

export default PricesList
