import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface LeverageControlsProps {
  value: number
  onIncrement: () => void
  onDecrement: () => void
}

const LeverageControls: React.FC<LeverageControlsProps> = ({ value, onIncrement, onDecrement }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onDecrement}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.value}>{value.toFixed(1)}x</Text>
      <TouchableOpacity style={styles.button} onPress={onIncrement}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 80,
    textAlign: 'center',
  },
})

export default LeverageControls 