import ThemedText from '@/src/components/common/ThemedText'
import { useAuth } from '@/src/context/AuthContext'
import { signInUser } from '@/src/services/auth.service'
import { ThemeColor } from '@/src/theme/theme-color'
import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

const AuthScreen = () => {
    const {login} = useAuth();      
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!email || !password) {
            console.log('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            const result = await signInUser(email, password, isLogin)
            if (result.token) {
                login({email}, result.token)
                console.log('Success:', isLogin ? 'Signed in' : 'Signed up')
            }
        } catch (error) {
            
            console.log('Error:', error instanceof Error ? error.message : 'Something went wrong')
        } finally {
            setLoading(false)
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
                
                <TouchableOpacity 
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <ThemedText size="button" style={styles.submitButtonText}>
                        {loading ? 'Loading...' : 'Submit'}
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
    submitButtonDisabled: {
        opacity: 0.7,
    },
})

export default AuthScreen