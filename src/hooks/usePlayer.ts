import { useEffect, useState } from 'react';

import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';
import { ServerItem } from './types/player';

export function useGetListServer() {
  const [data, setData] = useState<ServerItem[] | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const { executePost, isLoading } = usePost<ServerItem[], undefined>(endpoints.servers());

  const fetchData = async () => {
    try {
      const response = await executePost(undefined);
      if (response?.success) {
        setData(response.data);
        setError(undefined);
        return response.data;
      } else {
        const error = new Error(response?.message || 'Failed to fetch server list');
        setError(error);
        setData(undefined);
        throw error;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch server list');
      setError(error);
      setData(undefined);
      throw error;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData().catch(err => {
      console.error('Error fetching server list:', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to manually refetch data
  const refetch = () => {
    return fetchData();
  };

  return {
    serverData: data,
    isLoading,
    error,
    refetch,
  };
}
