import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../services/logger.service';
import { JWT_Token } from '../types/storage.types';

export const storeToken = async(token: string) => {
    try {
       await AsyncStorage.setItem(JWT_Token, token);
    } catch (error) {
        logger("storeToken", "error setting the jwt in async storage", error)
    }
}

export const getToken = async() => {
    try {
       const token = await AsyncStorage.getItem(JWT_Token);
       return token;
    } catch (error) {
        logger("getToken", "error getting the jwt in async storage", error)
    }
}

