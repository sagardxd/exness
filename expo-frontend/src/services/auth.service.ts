import apiCaller from "./api.service";

interface AuthResponse {
    token?: string;
    message?: string;
}

export const signInUser = async(email: string, password: string, isSignIn: boolean) => {
    try {
        const data: AuthResponse = await apiCaller.post<AuthResponse>(`/user/${isSignIn ? "signin" : "singup"}`, {
            email,
            password
        })

        if (data.token) {
            return data;
        } else {
            throw new Error(data.message || 'Sign in failed');
        }
    } catch (error) {
        throw error;
    }
}