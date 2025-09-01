import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";

const AppLayout = () => {
    const { user } = useAuth();

    if (!user) {
        return <Redirect href={'/(auth)'}/>
    }

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    )
}

export default AppLayout;  