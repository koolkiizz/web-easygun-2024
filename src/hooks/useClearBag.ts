import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';
import { Code } from './types/auth';

export function useRequestClearBag() {
  const { executePost, isLoading, isError } = usePost<undefined, undefined>(endpoints.requestClearBag());

  const requestClearBag = async () => {
    const response = await executePost(undefined);
    if (response?.success) {
      return response?.success;
    } else {
      throw new Error(response?.message);
    }
  };

  return {
    requestClearBag,
    isLoading,
    isError,
  };
}

export function useValidClearBag() {
  const { executePost, isLoading, isError } = usePost<undefined, Code>(endpoints.validClearBag());

  const validClearBag = async (payload: Code) => {
    const response = await executePost(payload);
    if (response?.success) {
      return response?.success;
    } else {
      throw new Error(response?.message);
    }
  };

  return {
    validClearBag,
    isLoading,
    isError,
  };
}
