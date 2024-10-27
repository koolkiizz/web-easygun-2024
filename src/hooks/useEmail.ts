import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';
import { Code } from './types/auth';
import { EmailPayload } from './types/email';

export function useChangeEmail() {
  const { executePost, isLoading, isError } = usePost<undefined, EmailPayload>(endpoints.changeEmail());

  const changeEmail = async (payload: EmailPayload) => {
    const response = await executePost(payload);
    if (response?.success) {
      return response?.success;
    } else {
      throw new Error(response?.message);
    }
  };

  return {
    changeEmail,
    isLoading,
    isError,
  };
}

export function useValidChangeEmail() {
  const { executePost, isLoading, isError } = usePost<undefined, Code>(endpoints.validChangeEmail());

  const validChangeEmail = async (code: Code) => {
    const response = await executePost(code);
    if (response?.success) {
      return response?.success;
    } else {
      throw new Error(response?.message);
    }
  };

  return {
    validChangeEmail,
    isLoading,
    isError,
  };
}
