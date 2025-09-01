import apiCaller from "./api.service";

interface AuthResponse {
    token?: string;
    message?: string;
}

interface UserMeResponse {
    email: string;
    message?: string;
}

export const signInUser = async(email: string, password: string, isSignIn: boolean) => {
    try {
        const data: AuthResponse = await apiCaller.post<AuthResponse>(`/user/${isSignIn ? "signin" : "signup"}`, {
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

export const getCurrentUser = async (): Promise<UserMeResponse> => {
    try {
        const data: UserMeResponse = await apiCaller.get<UserMeResponse>('/user/me');
        return data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error('Unauthorized: Please log in again');
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch user information');
    }
}