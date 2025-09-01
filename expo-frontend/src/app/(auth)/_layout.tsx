import { useAuth } from "@/src/context/AuthContext";
import { router, Stack } from "expo-router";

const AuthLayout = () => {
    
    const { user } = useAuth();

    if (user) {
        router.push("/(app)")
    }

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    )
}

export default AuthLayout;  