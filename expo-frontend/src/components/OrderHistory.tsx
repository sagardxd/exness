import ThemedText from '@/src/components/common/ThemedText'
import OrderItem from '@/src/components/OrderItem'
import { ThemeColor } from '@/src/theme/theme-color'
import { Order, OrderStatus } from '@/src/types/order.types'
import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const OrderHistory = () => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('open')

    // Separate arrays for open and closed orders
    const [openOrders] = useState<Order[]>([
        { 
            id: '1', 
            symbol: 'BTCUSDT', 
            type: 'buy', 
            volume: 0.08, 
            openPrice: 108770.16, 
            status: 'open' 
        },
        { 
            id: '2', 
            symbol: 'ETHUSDT', 
            type: 'sell', 
            volume: 2.0, 
            openPrice: 2800, 
            status: 'open' 
        },
    ])

    const [closedOrders] = useState<Order[]>([
        { 
            id: '3', 
            symbol: 'BTCUSDT', 
            type: 'buy', 
            volume: 0.04, 
            openPrice: 108718.61, 
            status: 'close',
            timestamp: 'Aug 30, 8:22 PM'
        },
        { 
            id: '4', 
            symbol: 'SOLUSDT', 
            type: 'sell', 
            volume: 10, 
            openPrice: 95, 
            status: 'close',
            timestamp: 'Aug 29, 3:15 PM'
        },
    ])

    const statusOptions: { key: OrderStatus; label: string }[] = [
        { key: 'open', label: 'Open' },
        { key: 'close', label: 'Close' }
    ]

    const handleStatusSelect = (status: OrderStatus) => {
        setSelectedStatus(status)
    }

    const handleCloseOrder = (orderId: string) => {
        console.log('Closing order:', orderId)
    }

    // Get orders based on selected status
    const filteredOrders = selectedStatus === 'open' ? openOrders : closedOrders

    return (
        <View style={styles.container}>
            <View style={styles.tabsContainer}>
                {statusOptions.map((option) => (
                    <TouchableOpacity
                        key={option.key}
                        style={[
                            styles.tab,
                            selectedStatus === option.key && styles.selectedTab
                        ]}
                        onPress={() => handleStatusSelect(option.key)}
                        activeOpacity={0.7}
                    >
                        <ThemedText
                            style={[
                                styles.tabText,
                                selectedStatus === option.key ? styles.selectedTabText : {}
                            ]}
                            size='sm'
                        >
                            {option.label} ({option.key === 'open' ? openOrders.length : closedOrders.length})
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer} >
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <OrderItem 
                            key={order.id} 
                            order={order} 
                            onCloseOrder={selectedStatus === 'open' ? handleCloseOrder : undefined}
                        />
                    ))
                ) : (
                    <ThemedText style={styles.descriptionText} size='sm'>
                        There are no {selectedStatus} orders 
                    </ThemedText>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: ThemeColor.background,
        flex: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: ThemeColor.backgroundLight,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: ThemeColor.border,
        padding: 4,
        margin: 16,
        gap: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTab: {
        backgroundColor: ThemeColor.background,
        borderWidth: 1,
        borderColor: ThemeColor.border,
    },
    tabText: {
        color: ThemeColor.text.secondary,
        fontWeight: '500',
    },
    selectedTabText: {
        color: ThemeColor.text.primary,
        fontWeight: '600',
    },
    contentContainer: {
        padding: 16,
        flexGrow: 1,
    },

    descriptionText: {
        color: ThemeColor.text.secondary,
        textAlign: 'center',
    },
})

export default OrderHistory