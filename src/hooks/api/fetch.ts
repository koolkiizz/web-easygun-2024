import useSWR, { KeyedMutator, SWRResponse } from 'swr';

import { BaseResponse } from '../types/auth';
import { apiClient } from './utils';

export function useGet<T>(url: string): {
  data: BaseResponse<T> | undefined;
  isLoading: boolean;
  isError: Error | undefined;
  mutate: KeyedMutator<BaseResponse<T>>;
} {
  const {
    data,
    error,
    mutate,
  }: SWRResponse<BaseResponse<T>, Error> = useSWR<BaseResponse<T>, Error>(url, apiClient.get);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function usePost<T, P>(
  url: string
): {
  executePost: (payload: P) => Promise<BaseResponse<T> | undefined>;
  data: BaseResponse<T> | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const {
    data,
    error,
    mutate,
  }: SWRResponse<BaseResponse<T>, Error> = useSWR<BaseResponse<T>, Error>(url, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const executePost = async (payload: P): Promise<BaseResponse<T> | undefined> => {
    const result = await apiClient.post<BaseResponse<T>, P>(url, payload);
    mutate(result, false); // Update the local data without revalidation

    return result;
  };

  return {
    executePost,
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function usePut<T, P>(
  url: string
): {
  executePut: (payload: P) => Promise<BaseResponse<T> | undefined>;
  data: BaseResponse<T> | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const {
    data,
    error,
    mutate,
  }: SWRResponse<BaseResponse<T>, Error> = useSWR<BaseResponse<T>, Error>(url, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const executePut = async (payload: P): Promise<BaseResponse<T> | undefined> => {
    const result = await apiClient.put<BaseResponse<T>, P>(url, payload);
    mutate(result, false); // Update the local data without revalidation
    return result;
  };

  return {
    executePut,
    data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useDelete<T>(url: string): {
  executeDelete: () => Promise<T | undefined>;
  data: T | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const {
    data,
    error,
    mutate,
  }: SWRResponse<BaseResponse<T>, Error> = useSWR<BaseResponse<T>, Error>(url, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const executeDelete = async (): Promise<T | undefined> => {
    const response = await apiClient.delete<BaseResponse<T>>(url);

    if (response?.success) {
      mutate(response, false);
      return response.data;
    } else {
      throw new Error(response?.message || 'Request failed');
    }
  };

  return {
    executeDelete,
    data: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
