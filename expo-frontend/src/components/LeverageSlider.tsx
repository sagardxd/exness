import { ThemeColor } from '@/src/theme/theme-color';
import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LeverageSliderProps {
    value: number
    onValueChange: (value: number) => void
}

const LeverageSlider: React.FC<LeverageSliderProps> = ({ value, onValueChange }) => {
    const handleSliderChange = (sliderValue: number) => {
        onValueChange(Math.round(sliderValue))
    }

    return (
        <View style={styles.container}>
            <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                value={Math.round(value)}
                onValueChange={handleSliderChange}
                minimumTrackTintColor={ThemeColor.success}
                maximumTrackTintColor="#444"
                thumbTintColor={ThemeColor.success}
                step={1}
            />
            <View style={styles.labels}>
                <Text style={styles.label}>1x</Text>
                <Text style={styles.label}>50x</Text>
                <Text style={styles.label}>100x</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginVertical: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 10,
    },
    label: {
        color: '#666',
        fontSize: 12,
    },
})

export default LeverageSlider 