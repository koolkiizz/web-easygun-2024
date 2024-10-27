import { useState } from 'react';

import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';
import { Code } from './types/auth';
import { BankInfo, TransferCoinPayload } from './types/coin';

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

export function useTransferCoin() {
  const { executePost, isLoading, isError } = usePost<undefined, TransferCoinPayload>(endpoints.transferCoin());

  const transferCoin = async (payload: TransferCoinPayload) => {
    const response = await executePost(payload);
    if (response?.success) {
      return response?.success;
    } else {
      throw new Error(response?.message);
    }
  };

  return {
    transferCoin,
    isLoading,
    isError,
  };
}

export function useValidTransfer() {
  const { executePost, isLoading, isError } = usePost<undefined, Code>(endpoints.validTransfer());

  const validTransfer = async (payload: Code) => {
    const response = await executePost(payload);
    if (response?.success) {
      return response?.success;
    } else {
      throw new Error(response?.message);
    }
  };

  return {
    validTransfer,
    isLoading,
    isError,
  };
}
