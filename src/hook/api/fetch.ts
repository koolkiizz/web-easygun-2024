import useSWR, { KeyedMutator, SWRResponse } from 'swr';

import { apiClient } from './utils';

export function useGet<T>(url: string): {
  data: T | undefined;
  isLoading: boolean;
  isError: Error | undefined;
  mutate: KeyedMutator<T>;
} {
  const { data, error, mutate }: SWRResponse<T, Error> = useSWR<T, Error>(url, apiClient.get);

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
  executePost: (payload: P) => Promise<T>;
  data: T | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const { data, error, mutate }: SWRResponse<T, Error> = useSWR<T, Error>(url, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  console.log('API call to:', url);
  const executePost = async (payload: P): Promise<T> => {
    const result = await apiClient.post<T, P>(url, payload);
    mutate(result, false); // Update the local data without revalidation
    return result;
  };

  return {
    executePost,
    data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function usePut<T, P>(
  url: string
): {
  executePut: (payload: P) => Promise<T>;
  data: T | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const { data, error, mutate }: SWRResponse<T, Error> = useSWR<T, Error>(url, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const executePut = async (payload: P): Promise<T> => {
    const result = await apiClient.put<T, P>(url, payload);
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
  executeDelete: () => Promise<T>;
  data: T | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const { data, error, mutate }: SWRResponse<T, Error> = useSWR<T, Error>(url, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const executeDelete = async (): Promise<T> => {
    const result = await apiClient.delete<T>(url);
    mutate(result, false); // Update the local data without revalidation
    return result;
  };

  return {
    executeDelete,
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
