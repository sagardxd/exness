import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import ThemedText from '../../components/common/ThemedText'
import { ThemeColor } from '../../theme/theme-color'

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = () => {
        if (isLogin) {
            console.log('Signing in with:', email, password)
        } else {
            console.log('Signing up with:', email, password)
        }
    }

    return (
        <View style={styles.container}>
            <ThemedText size="xxl" style={styles.title}>
                {isLogin ? 'Login' : 'Register'}
            </ThemedText>
            
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={ThemeColor.text.tertiary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={ThemeColor.text.tertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <ThemedText size="button" style={styles.submitButtonText}>
                        Submit
                    </ThemedText>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
                style={styles.toggleButton} 
                onPress={() => setIsLogin(!isLogin)}
            >
                <ThemedText size="sm">
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </ThemedText>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ThemeColor.background,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 40,
    },
    form: {
        gap: 16,
        marginBottom: 30,
    },
    input: {
        backgroundColor: ThemeColor.card,
        borderColor: ThemeColor.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        color: ThemeColor.text.primary,
    },
    submitButton: {
        backgroundColor: ThemeColor.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: ThemeColor.background,
    },
    toggleButton: {
        alignItems: 'center',
    },
})

export default AuthScreen