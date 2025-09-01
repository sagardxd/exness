export type OrderStatus = 'open' | 'close' 

export interface Order {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  volume: number
  openPrice: number
  status: OrderStatus
  timestamp?: string
} 