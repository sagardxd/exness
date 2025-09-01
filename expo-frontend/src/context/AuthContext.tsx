import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth.service";
import { removeToken, storeToken } from "../storage/auth.storage";

interface User {
    email: string
}

type AuthContextType = {
    user: User | null;
    login: (user: User, token:string) => void;
    logout: () => void;
    getCurrentUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCurrentUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const login = async(user: User, token:string) => {
        setUser(user);
        await storeToken(token);
        router.push("/(app)")
    }

    const logout = async() => {
        setUser(null);
        await removeToken();
        router.push("/(auth)")
    }

    return (
        <AuthContext.Provider value={{ login, user, logout, getCurrentUser: fetchCurrentUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}