import axios, { AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const config = {
  API_BASE_URL: '/api', // Always use the proxy path in development
  withCredentials: false, // Set to false to avoid CORS issues
  AUTH_TOKEN_KEY: 'token',
};

const getToken = (): string | null => {
  return localStorage.getItem(config.AUTH_TOKEN_KEY);
};

const api: AxiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'User-Agent': 'RestSharp/105.2.3.0',
    // Add these headers to help bypass Cloudflare
    // 'CF-Access-Client-Id': 'YOUR_CLIENT_ID',
    // 'CF-Access-Client-Secret': 'YOUR_CLIENT_SECRET',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    const headers = config.headers as AxiosHeaders;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Add additional headers that might help bypass Cloudflare
    headers.set('User-Agent', 'RestSharp/105.2.3.0');
    headers.set('Origin', 'http://prod.easygunny.xyz');
    headers.set('Referer', 'http://prod.easygunny.xyz/');

    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);
// Response interceptor for handling errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem(config.AUTH_TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const poster = async <T, P>(url: string, data: P): Promise<T> => {
  try {
    const response = await api.post<T, AxiosResponse<T>, P>(url, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const putter = async <T, P>(url: string, data: P): Promise<T> => {
  try {
    const response = await api.put<T, AxiosResponse<T>, P>(url, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const deleter = async <T>(url: string): Promise<T> => {
  try {
    const response = await api.delete<T>(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  } else {
    console.error('Unknown error:', error);
  }
};

export const apiClient = {
  get: fetcher,
  post: poster,
  put: putter,
  delete: deleter,
};
