import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';
import { Code } from './types/auth';
import { ClearBagPayload } from './types/clear-bag';

export function useRequestClearBag() {
  const { executePost, isLoading, isError } = usePost<undefined, ClearBagPayload>(endpoints.requestClearBag());

  const requestClearBag = async (payload: ClearBagPayload) => {
    const response = await executePost(payload);
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
