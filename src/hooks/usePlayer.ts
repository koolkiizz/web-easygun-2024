import { useCallback, useEffect, useRef, useState } from 'react';

import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';
import { CoinInfo, PlayerItem, PlayerPayload, ServerItem } from './types/player';

// Base hook for post requests with data
const usePostData = <TData, TPayload>(endpoint?: string, initialFetch = true) => {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const initialFetchRef = useRef(false);

  const { executePost, isLoading } = usePost<TData, TPayload | undefined>(endpoint || '');

  const fetchData = useCallback(
    async (payload?: TPayload) => {
      if (!endpoint) return;
      try {
        const response = await executePost(payload);
        if (response?.success) {
          setData(response.data);
          setError(undefined);
          return response.data;
        } else {
          const error = new Error(response?.message || 'Failed to fetch data');
          setError(error);
          setData(undefined);
          throw error;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch data');
        setError(error);
        setData(undefined);
        throw error;
      }
    },
    [endpoint, executePost]
  );

  // Initial fetch
  useEffect(() => {
    if (initialFetch && endpoint && !initialFetchRef.current) {
      initialFetchRef.current = true;
      fetchData().catch(err => {
        console.error('Error fetching data:', err);
      });
    }
  }, [initialFetch, endpoint, fetchData]);

  return {
    data,
    isLoading,
    error,
    fetchData,
  };
};

export function useGetListServer(initialFetch = true) {
  const {
    data: serverData,
    isLoading,
    error,
    fetchData: refetch,
  } = usePostData<ServerItem[], undefined>(endpoints.servers(), initialFetch);

  return {
    serverData,
    isLoading,
    error,
    refetch,
  };
}

export function useGetListPlayers(server_id?: string, initialFetch = false) {
  const previousServerIdRef = useRef(server_id);
  const {
    data: playerData,
    isLoading,
    error,
    fetchData: refetch,
  } = usePostData<PlayerItem[], PlayerPayload>(server_id ? endpoints.players() : undefined, initialFetch);

  // Fetch players only when server_id changes
  useEffect(() => {
    if (server_id && server_id !== previousServerIdRef.current) {
      previousServerIdRef.current = server_id;
      refetch({ server_id });
    }
  }, [server_id, refetch]);

  return {
    playerData,
    isLoading,
    error,
    refetch: () => (server_id ? refetch({ server_id }) : Promise.resolve()),
  };
}

export function useGetCoin(initialFetch = true) {
  const {
    data: coinData,
    isLoading,
    error,
    fetchData: refetch,
  } = usePostData<CoinInfo, undefined>(endpoints.coinInfo(), initialFetch);

  return {
    coinData,
    isLoading,
    error,
    refetch,
  };
}
