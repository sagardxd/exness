import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useMemo, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ThemeColor } from '../theme/theme-color'
import { Symbol, WSTradeData } from '../types/live-price.types'
import AssetSelector from './AssetSelector'
import LeverageControls from './LeverageControls'
import LeverageSlider from './LeverageSlider'

interface TradingModalProps {
  isVisible: boolean
  onClose: () => void
  selectedAsset: Symbol
  data: WSTradeData | null
  tradeType: 'buy' | 'sell'
}

const TradingModal: React.FC<TradingModalProps> = ({
  isVisible,
  onClose,
  selectedAsset,
  data,
  tradeType,
}) => {
  const [volume, setVolume] = useState('')
  const [leverage, setLeverage] = useState(40.2)
  const bottomSheetRef = useRef<BottomSheet>(null)

  const snapPoints = useMemo(() => ['85%'], [])

  if (!isVisible) return null

  const handleLeverageIncrement = () => {
    setLeverage(prev => Math.min(Math.round(prev) + 10, 100))
  }

  const handleLeverageDecrement = () => {
    setLeverage(prev => Math.max(Math.round(prev) - 10, 1))
  }

  const currentPrice = tradeType === 'buy' && data?.buyPrice 
    ? (Number(data.buyPrice) / 10000).toFixed(3)
    : tradeType === 'sell' && data?.sellPrice
    ? (Number(data.sellPrice) / 10000).toFixed(3)
    : 'N/A'

  // Check if button should be disabled
  const isButtonDisabled = !volume || Number(volume) <= 0

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints} 
      enablePanDownToClose={true}
      onClose={onClose}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {tradeType === 'buy' ? 'Long/Buy' : 'Short/Sell'} {selectedAsset?.replace("USDT", "")}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>You're paying</Text>
              <AssetSelector 
                asset={selectedAsset} 
                assetPrice={currentPrice}
                amount={volume} 
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Price</Text>
              <Text style={styles.price}>${currentPrice}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Margin</Text>
              <TextInput
                style={styles.input}
                value={volume}
                onChangeText={setVolume}
                placeholder="Enter volume"
                keyboardType="decimal-pad"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Leverage</Text>
              <LeverageControls 
                value={leverage}
                onIncrement={handleLeverageIncrement}
                onDecrement={handleLeverageDecrement}
              />
              <LeverageSlider 
                value={leverage}
                onValueChange={setLeverage}
              />
            </View>

            <View style={styles.section}>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { 
                    backgroundColor: isButtonDisabled 
                      ? '#666' 
                      : tradeType === 'buy' 
                        ? ThemeColor.success 
                        : ThemeColor.error 
                  }
                ]}
                disabled={isButtonDisabled}
              >
                <Text style={styles.actionButtonText}>
                  {tradeType === 'buy' ? 'Long/Buy' : 'Short/Sell'} {selectedAsset?.replace("USDT", "")}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: ThemeColor.card,
  },
  indicator: {
    backgroundColor: '#666',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default TradingModal
