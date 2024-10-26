import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';
import { RegisterRequest } from './types/auth';

export function useRegister() {
  const { executePost, isLoading, isError } = usePost<undefined, RegisterRequest>(endpoints.register());

  const register = async (payload: RegisterRequest) => {
    const response = await executePost(payload);
    if (response?.success) {
      return response?.success;
    } else {
      throw new Error(response?.message);
    }
  };

  return {
    register,
    isLoading,
    isError,
  };
}
