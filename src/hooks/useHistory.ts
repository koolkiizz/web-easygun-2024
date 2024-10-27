import { useEffect, useState } from 'react';

import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';
import { TransferHistoryItem } from './types/history';

export function useGetTransferHistory(initialFetch = true) {
  const [data, setData] = useState<TransferHistoryItem[] | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const { executePost, isLoading } = usePost<TransferHistoryItem[], undefined>(endpoints.transferHistory());

  const fetchData = async () => {
    try {
      const response = await executePost(undefined);
      if (response?.success) {
        setData(response.data);
        setError(undefined);
        return response.data;
      } else {
        const error = new Error(response?.message || 'Failed to fetch history');
        setError(error);
        setData(undefined);
        throw error;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch history');
      setError(error);
      setData(undefined);
      throw error;
    }
  };

  useEffect(() => {
    if (initialFetch) {
      fetchData().catch(err => {
        console.error('Error fetching history:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFetch]);

  return {
    historyData: data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
