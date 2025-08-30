import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemeColor } from '../theme/theme-color'
import { Symbol, WSTradeData } from '../types/live-price.types'
import ThemedText from './common/ThemedText'

interface TradeProps {
  data: WSTradeData | null
  selectedAsset: Symbol
}

const Trade: React.FC<TradeProps> = ({ selectedAsset, data }) => {
  const handleBuyOrder = () => {
    console.log('Buy order placed')
  }

  const handleSellOrder = () => {
    console.log('Sell order placed')
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
            Buy {selectedAsset.replace("USDT", "")}
          </ThemedText>
          {data?.buyPrice && <ThemedText size='sm' style={styles.priceButtonText}>{(Number(data.buyPrice) / 10000).toFixed(3)}</ThemedText>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.sellButton]}
          onPress={handleSellOrder}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.sellButtonText} size='md'>
            Sell {selectedAsset.replace("USDT", "")}
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
  contentContainer: {
    padding: 16,
  },
  titleText: {
    color: ThemeColor.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  orderForm: {
    backgroundColor: ThemeColor.backgroundLight,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    color: ThemeColor.text.secondary,
  },
  valueText: {
    color: ThemeColor.text.primary,
    fontWeight: '500',
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
    paddingVertical: 10,
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