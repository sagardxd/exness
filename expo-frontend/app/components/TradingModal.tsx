import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useMemo, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { ThemeColor } from '../theme/theme-color'
import { Symbol, WSTradeData } from '../types/live-price.types'
import AssetDetails from './AssetDetails'
import LeverageControls from './LeverageControls'
import LeverageSlider from './LeverageSlider'
import ThemedText from './common/ThemedText'

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
  const [margin, setMargin] = useState('')
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
  const isButtonDisabled = !margin || Number(margin) <= 0

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
              <ThemedText size="lg" style={styles.title}>
                {tradeType === 'buy' ? 'Long/Buy' : 'Short/Sell'} {selectedAsset?.replace("USDT", "")}
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText variant="secondary" style={styles.sectionTitle}>Asset Details</ThemedText>
              <AssetDetails
                asset={selectedAsset} 
                assetPrice={currentPrice}
                margin={margin}
                leverage={leverage} 
              />
            </View>

            <View style={styles.section}>
              <ThemedText variant="secondary" style={styles.sectionTitle}>Current Price</ThemedText>
              <ThemedText size="xl" variant="success">${currentPrice}</ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText variant="secondary" style={styles.sectionTitle}>
                Margin <ThemedText size="sm" variant="tertiary">(in $)</ThemedText>
              </ThemedText>
              <TextInput
                style={styles.input}
                value={margin}
                onChangeText={setMargin}
                placeholder="Enter margin"
                keyboardType="decimal-pad"
                placeholderTextColor={ThemeColor.text.tertiary}
              />
            </View>

            <View style={styles.section}>
              <ThemedText variant="secondary" style={styles.sectionTitle}>Leverage</ThemedText>
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
                      ? ThemeColor.text.tertiary
                      : tradeType === 'buy' 
                        ? ThemeColor.success 
                        : ThemeColor.error 
                  }
                ]}
                disabled={isButtonDisabled}
              >
                <ThemedText size="button" style={styles.actionButtonText}>
                  {tradeType === 'buy' ? 'Long/Buy' : 'Short/Sell'} {selectedAsset?.replace("USDT", "")}
                </ThemedText>
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
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: ThemeColor.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: ThemeColor.backgroundLight,
    color: ThemeColor.text.primary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: ThemeColor.text.primary,
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
    color: ThemeColor.text.primary,
  },
})

export default TradingModal
