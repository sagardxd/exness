import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemeColor } from '../theme/theme-color'
import ThemedText from './common/ThemedText'

type OrderStatus = 'open' | 'close' | 'pending'

const OrderHistory = () => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('open')

    const statusOptions: { key: OrderStatus; label: string }[] = [
        { key: 'open', label: 'Open' },
        { key: 'close', label: 'Close' },
        { key: 'pending', label: 'Pending' }
    ]

    const handleStatusSelect = (status: OrderStatus) => {
        setSelectedStatus(status)
    }

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
                            {option.label}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.contentContainer}>
                <ThemedText style={styles.statusText} size='md'>
                    Showing {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Orders
                </ThemedText>
                <ThemedText style={styles.descriptionText} size='sm'>
                    This is where the {selectedStatus} orders will be displayed
                </ThemedText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: ThemeColor.background,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        color: 'white',
        marginBottom: 8,
    },
    descriptionText: {
        color: ThemeColor.text.secondary,
        textAlign: 'center',
    },
})

export default OrderHistory