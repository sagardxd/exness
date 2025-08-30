import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Symbol } from '../types/live-price.types'
import ThemedText from './common/ThemedText'

interface AssetSelectorProps {
  asset: Symbol
  assetPrice: string
  amount: string
}

const AssetSelector: React.FC<AssetSelectorProps> = ({ asset, amount, assetPrice = null }) => {
  return (
    <View style={styles.container}>
      <View style={styles.selector}>
        <View style={styles.assetInfo}>
          <View style={styles.icon}>
            <ThemedText style={styles.iconText}>{asset.replace("USDT", "").charAt(0)}</ThemedText>
          </View>
          <ThemedText style={styles.name}>{asset.replace("USDT", "")}</ThemedText>
        </View>
        {assetPrice && amount && <ThemedText style={styles.amountValue}>{(Number(amount)/parseFloat(assetPrice)).toFixed(8)}</ThemedText>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  amountValue: {
    color: '#ccc',
    fontSize: 12,
  },
})

export default AssetSelector 