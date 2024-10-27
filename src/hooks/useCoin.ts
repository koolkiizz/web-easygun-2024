import { useState } from 'react';

import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';
import { BankInfo } from './types/coin';

export function useGetQRBank() {
  // State for storing bank data
  const [acbData, setAcbData] = useState<BankInfo | undefined>(undefined);
  const [mbData, setMbData] = useState<BankInfo | undefined>(undefined);

  // Post hooks for both banks
  const {
    executePost: executePostACB,
    isLoading: isLoadingACB,
    isError: isErrorACB,
  } = usePost<BankInfo, undefined>(endpoints.acb());

  const {
    executePost: executePostMB,
    isLoading: isLoadingMB,
    isError: isErrorMB,
  } = usePost<BankInfo, undefined>(endpoints.mb());

  const getACBBank = async () => {
    try {
      const response = await executePostACB(undefined);
      if (response?.success) {
        setAcbData(response.data);
        return response.data;
      } else {
        throw new Error(response?.message || 'Failed to get ACB bank info');
      }
    } catch (error) {
      console.error('Error getting ACB bank:', error);
      throw error;
    }
  };

  const getMBBank = async () => {
    try {
      const response = await executePostMB(undefined);
      if (response?.success) {
        setMbData(response.data);
        return response.data;
      } else {
        throw new Error(response?.message || 'Failed to get MB bank info');
      }
    } catch (error) {
      console.error('Error getting MB bank:', error);
      throw error;
    }
  };

  // Function to get both banks' data
  const getBanksData = async () => {
    try {
      await Promise.all([getACBBank(), getMBBank()]);
    } catch (error) {
      console.error('Error getting banks data:', error);
      throw error;
    }
  };

  return {
    acbData,
    mbData,
    getACBBank,
    getMBBank,
    getBanksData,
    isLoading: isLoadingACB || isLoadingMB,
    isLoadingACB,
    isLoadingMB,
    isError: isErrorACB || isErrorMB,
    isErrorACB,
    isErrorMB,
  };
}
