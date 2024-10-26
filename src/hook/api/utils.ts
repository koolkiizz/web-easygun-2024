import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://prod.easygunny.xyz/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'User-Agent': 'RestSharp/105.2.3.0',
  },
  withCredentials: true, // Include this if the API uses cookies for authentication
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export const fetcher = <T>(url: string): Promise<T> => api.get<T>(url).then(res => res.data);

// export const poster = <T, P>(url: string, data: P): Promise<T> =>
//   api.post<T, AxiosResponse<T>, P>(url, data).then(res => res.data);

export const poster = <T, P>(url: string, data: P): Promise<T> =>
  api.post<T, AxiosResponse<T>, P>(url, data).then(res => res.data);

export const putter = <T, P>(url: string, data: P): Promise<T> =>
  api.put<T, AxiosResponse<T>, P>(url, data).then(res => res.data);

export const deleter = <T>(url: string): Promise<T> => api.delete<T>(url).then(res => res.data);

export const apiClient = {
  get: fetcher,
  post: poster,
  put: putter,
  delete: deleter,
};
