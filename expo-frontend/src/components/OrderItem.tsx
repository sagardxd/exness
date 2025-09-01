import ThemedText from '@/src/components/common/ThemedText'
import { ThemeColor } from '@/src/theme/theme-color'
import { Order } from '@/src/types/order.types'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface OrderItemProps {
  order: Order
  onCloseOrder?: (orderId: string) => void
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onCloseOrder }) => {
  const isOpen = order.status === 'open'

  const profitLoss = 10;
  const currentPrice = 1212
  
  if (isOpen) {
    return (
      <View style={styles.orderItem}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.assetInfo}>
              <ThemedText style={styles.assetName} size='md'>
                {order.symbol.replace('USDT', '')}
              </ThemedText>
            </View>
            <View style={styles.topRight}>
              <ThemedText 
                style={[
                  styles.profitLoss, 
                  { color: (profitLoss || 0) >= 0 ? ThemeColor.success : ThemeColor.error }
                ]} 
                size='md'
              >
                {(profitLoss || 0) >= 0 ? '+' : ''}{profitLoss?.toFixed(2)} USD
              </ThemedText>
              {onCloseOrder && (
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => onCloseOrder(order.id)}
                >
                  <ThemedText style={styles.closeButtonText} size='sm'>×</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.bottomSection}>
            <ThemedText 
              style={[
                styles.orderType, 
                { color: order.type === 'buy' ? ThemeColor.primary : ThemeColor.error }
              ]} 
              size='sm'
            >
              {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
            </ThemedText>
            <ThemedText style={styles.orderDetails} size='sm'>
              {order.volume} lots at = {order.openPrice.toLocaleString()}
            </ThemedText>
            <ThemedText style={styles.currentPrice} size='sm'>
              {currentPrice}
            </ThemedText>
          </View>
        </View>
      </View>
    )
  } else {
    // Closed order layout
    return (
      <View style={styles.orderItem}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.assetInfo}>
              <ThemedText style={styles.assetName} size='md'>
                {order.symbol.replace('USDT', '')}
              </ThemedText>
            </View>
            <ThemedText 
              style={[
                styles.profitLoss, 
                { color: (profitLoss || 0) >= 0 ? ThemeColor.success : ThemeColor.error }
              ]} 
              size='md'
            >
              {(profitLoss || 0) >= 0 ? '+' : ''}{profitLoss.toFixed(2)} USD
            </ThemedText>
          </View>
          <View style={styles.bottomSection}>
            <ThemedText 
              style={[
                styles.orderType, 
                { color: order.type === 'buy' ? ThemeColor.primary : ThemeColor.error }
              ]} 
              size='sm'
            >
              {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
            </ThemedText>
            <ThemedText style={styles.orderDetails} size='sm'>
              {order.volume} lots at {order.openPrice.toLocaleString()}
            </ThemedText>
            <ThemedText style={styles.timestamp} size='sm'>
              {order.timestamp}
            </ThemedText>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  orderItem: {
    backgroundColor: ThemeColor.backgroundLight,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ThemeColor.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  leftBorder: {
    width: 4,
    backgroundColor: ThemeColor.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assetSymbol: {
    color: 'white',
    fontWeight: '600',
  },
  assetName: {
    color: ThemeColor.text.primary,
    fontWeight: '600',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profitLoss: {
    fontWeight: '600',
  },
  closeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ThemeColor.text.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: ThemeColor.background,
    fontWeight: '600',
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderType: {
    fontWeight: '600',
  },
  orderDetails: {
    color: ThemeColor.text.secondary,
    flex: 1,
  },
  currentPrice: {
    color: ThemeColor.text.secondary,
  },
  timestamp: {
    color: ThemeColor.text.secondary,
  },
})

export default OrderItem 