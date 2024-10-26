import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://prod.easygunny.xyz/api';

// Token utilities
const AUTH_TOKEN_KEY = 'token';

const getToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'User-Agent': 'RestSharp/105.2.3.0',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      // Ensure headers object exists
      config.headers = config.headers || {};

      // Set authorization header
      config.headers.Authorization = `Bearer ${token}`;

      // Log for debugging (remove in production)
      console.log('Request headers:', config.headers);
    } else {
      console.warn('No token found in localStorage');
    }

    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (token expired or invalid)
      localStorage.removeItem(AUTH_TOKEN_KEY);
      // You might want to redirect to login page or refresh token here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Enhanced API methods with better error handling
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

// Error handling utility
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // You might want to handle specific error cases here
    if (error.response?.status === 401) {
      console.error('Unauthorized access');
    } else if (error.response?.status === 403) {
      console.error('Forbidden access');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    }
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

// Auth token management utilities
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  getToken,
  removeToken: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
  hasToken: () => !!getToken(),
};
