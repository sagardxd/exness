import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemeColor } from '../theme/theme-color'
import { Symbol, WSTradeData } from '../types/live-price.types'
import ThemedText from './common/ThemedText'

interface TradeProps {
  data: WSTradeData | null
  selectedAsset: Symbol
  onOpenModal: (type: 'buy' | 'sell') => void
}

const Trade: React.FC<TradeProps> = ({ selectedAsset, data, onOpenModal }) => {
  const handleBuyOrder = () => {
    onOpenModal('buy')
  }

  const handleSellOrder = () => {
    onOpenModal('sell')
  }

  return (
    <View style={styles.container}>
      {/* Action Buttons - Stuck to Bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.buyButton]}
          onPress={handleBuyOrder}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buyButtonText} size='md'>
            Buy {selectedAsset?.replace("USDT", "") || "Asset"}
          </ThemedText>
          {data?.buyPrice && <ThemedText size='sm' style={styles.priceButtonText}>{(Number(data.buyPrice) / 10000).toFixed(3)}</ThemedText>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.sellButton]}
          onPress={handleSellOrder}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.sellButtonText} size='md'>
            Sell {selectedAsset?.replace("USDT", "") || "Asset"}
          </ThemedText>
          {data?.sellPrice && <ThemedText size='sm' style={styles.priceButtonText}>{(Number(data.sellPrice) / 10000).toFixed(3)}</ThemedText>}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColor.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: ThemeColor.background,
    borderTopWidth: 1,
    borderTopColor: ThemeColor.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButton: {
    backgroundColor: ThemeColor.success,
  },
  sellButton: {
    backgroundColor: ThemeColor.error,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  sellButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  priceButtonText: {
    color: 'white'
  }
})

export default Trade  