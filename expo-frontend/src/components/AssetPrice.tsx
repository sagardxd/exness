import ThemedText from '@/src/components/common/ThemedText'
import { ThemeColor } from '@/src/theme/theme-color'
import { Symbol, WSTradeData } from '@/src/types/live-price.types'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'

interface AssetPriceProps {
    priceData: WSTradeData | null
    setSelectedAsset: (asset: Symbol) => void
    isSelected?: boolean
}

const AssetPrice: React.FC<AssetPriceProps> = ({ priceData, setSelectedAsset, isSelected = false }) => {
    const styles = assetPriceStyles
    const buyIconAnimation = useRef(new Animated.Value(1)).current
    const sellIconAnimation = useRef(new Animated.Value(1)).current
    const prevBuyPrice = useRef<number | null>(null)
    const prevSellPrice = useRef<number | null>(null)

    useEffect(() => {
        if (priceData) {
            const currentBuyPrice = Number(priceData.buyPrice) / 10000
            const currentSellPrice = Number(priceData.sellPrice) / 10000

            // Check buy price change
            if (prevBuyPrice.current !== null) {
                if (currentBuyPrice > prevBuyPrice.current) {
                    // Price increased - flash icon
                    Animated.sequence([
                        Animated.timing(buyIconAnimation, {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: false,
                        }),
                        Animated.timing(buyIconAnimation, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: false,
                        })
                    ]).start()
                } else if (currentBuyPrice < prevBuyPrice.current) {
                    // Price decreased - flash icon
                    Animated.sequence([
                        Animated.timing(buyIconAnimation, {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: false,
                        }),
                        Animated.timing(buyIconAnimation, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: false,
                        })
                    ]).start()
                }
            }

            // Check sell price change
            if (prevSellPrice.current !== null) {
                if (currentSellPrice > prevSellPrice.current) {
                    // Price increased - flash icon
                    Animated.sequence([
                        Animated.timing(sellIconAnimation, {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: false,
                        }),
                        Animated.timing(sellIconAnimation, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: false,
                        })
                    ]).start()
                } else if (currentSellPrice < prevSellPrice.current) {
                    // Price decreased - flash icon
                    Animated.sequence([
                        Animated.timing(sellIconAnimation, {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: false,
                        }),
                        Animated.timing(sellIconAnimation, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: false,
                        })
                    ]).start()
                }
            }

            // Update previous prices
            prevBuyPrice.current = currentBuyPrice
            prevSellPrice.current = currentSellPrice
        }
    }, [priceData?.buyPrice, priceData?.sellPrice])

    // Always render the component, even if no price data
    const isLoading = !priceData;

    const handlePress = () => {
        if (priceData) {
            setSelectedAsset(priceData.symbol as Symbol);
        }
    };

    return (
        <TouchableOpacity 
            key={priceData?.symbol || 'loading'} 
            style={[
                styles.priceCard,
                isSelected && styles.selectedCard
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <ThemedText style={styles.symbolText} size='sm'>
                    {priceData?.symbol || 'Loading...'}
                </ThemedText>
            </View>

            {!isLoading ? (
                <View style={styles.priceInfo}>
                    <View style={styles.priceRow}>
                        <ThemedText style={styles.buyPrice} size='xs'>
                            ${(Number(priceData!.buyPrice) / 10000).toFixed(3)}
                        </ThemedText>
                        <Animated.View style={{ opacity: buyIconAnimation }}>
                            <Ionicons name="arrow-up" size={12} color={ThemeColor.success} />
                        </Animated.View>
                    </View>

                    <View style={styles.priceRow}>
                        <ThemedText style={styles.sellPrice} size='xs'>
                            ${(Number(priceData!.sellPrice) / 10000).toFixed(3)}
                        </ThemedText>
                        <Animated.View style={{ opacity: sellIconAnimation }}>
                            <Ionicons name="arrow-down" size={12} color={ThemeColor.error} />
                        </Animated.View>
                    </View>
                </View>
            ) : (
                <View style={styles.loadingContainer}>
                    <ThemedText style={styles.loadingText} size='xs'>Loading...</ThemedText>
                </View>
            )}
        </TouchableOpacity>
    )
}

const assetPriceStyles = StyleSheet.create({
    priceCard: {
        backgroundColor: ThemeColor.backgroundLight,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: ThemeColor.border,
        maxHeight: 60,
        minWidth: 100,
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    symbolText: {
        color: ThemeColor.text.primary,
        fontWeight: '700',
    },
    priceInfo: {
        gap: 2,
        flexBasis: 'auto',
        alignContent: 'center',
        alignItems: 'center'
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    priceLabel: {
        color: ThemeColor.text.secondary,
    },
    buyPrice: {
        color: ThemeColor.success,
        fontSize: 12,
        fontWeight: '500',
    },
    sellPrice: {
        color: ThemeColor.error,
        fontSize: 12,
        fontWeight: '500',
    },
    noData: {
        color: ThemeColor.text.tertiary,
        fontStyle: 'italic',
    },
    selectedCard: {
        backgroundColor: ThemeColor.backgroundLight,
        borderColor: ThemeColor.primary,
        borderWidth: 2,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: ThemeColor.text.tertiary,
        fontStyle: 'italic',
    }
})

export default AssetPrice