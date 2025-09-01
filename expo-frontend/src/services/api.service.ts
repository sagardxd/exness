import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '../storage/auth.storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to automatically include JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token for request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.get(url, config);
  return response.data;
};

const post = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.post(url, data, config);
  return response.data;
};

const put = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.put(url, data, config);
  return response.data;
};

// ✅ Export as object
const apiCaller = {
  get,
  post,
  put,
};

export default apiCaller;
