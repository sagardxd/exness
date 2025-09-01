import { router } from "expo-router";
import React, { createContext, useContext, useState } from "react";
import { removeAuthToken } from "../services/api.service";

interface User {
    email: string
}

type AuthContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (user: User) => {
        setUser(user);
        // Token will be automatically added by the interceptor
    }

    const logout = () => {
        setUser(null);
        removeAuthToken(); // Remove token from axios headers
        router.push("/(auth)")
    }

    return (
        <AuthContext.Provider value={{ login, user, logout }}>
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