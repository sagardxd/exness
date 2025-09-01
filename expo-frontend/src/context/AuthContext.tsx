import { useRouter } from "expo-router";
import React, { createContext, useContext, useState } from "react";

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
    const router = useRouter();
    const [user, setUser] = useState<User | null>({email: 'sagardxd5@gmail.com'});


    const login = (user: User) => {
        setUser(user);
        router.push("/(app)")
    }

    const logout = () => {
        setUser(null);
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