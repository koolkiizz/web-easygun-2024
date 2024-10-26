import { PASSWORD_VALIDATION } from '@/lib/constants';
import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';
import { ChangePasswordCredentials, LoginCredentials, LoginResponse } from './types/auth';

export function useLogin() {
  const { executePost, isLoading, isError } = usePost<LoginResponse, LoginCredentials>(endpoints.login());

  const login = async (username: string, password: string) => {
    const response = await executePost({ username, password });
    if (response?.success) {
      return response?.data;
    } else {
      throw new Error(response?.message);
    }
  };

  return {
    login,
    isLoading,
    isError,
  };
}

export function useChangePassword() {
  const { executePost, isLoading, isError } = usePost<undefined, ChangePasswordCredentials>(endpoints.changePassword());

  const validatePasswords = (credentials: ChangePasswordCredentials): void => {
    const { current_password, new_password, re_new_password } = credentials;

    const validations = [
      {
        condition: !current_password || !new_password || !re_new_password,
        message: PASSWORD_VALIDATION.ERRORS.REQUIRED,
      },
      {
        condition: new_password !== re_new_password,
        message: PASSWORD_VALIDATION.ERRORS.MISMATCH,
      },
      {
        condition: new_password === current_password,
        message: PASSWORD_VALIDATION.ERRORS.SAME_AS_CURRENT,
      },
      {
        condition: new_password.length < PASSWORD_VALIDATION.MIN_LENGTH,
        message: PASSWORD_VALIDATION.ERRORS.MIN_LENGTH,
      },
    ];

    const failedValidation = validations.find(({ condition }) => condition);
    if (failedValidation) {
      throw new Error(failedValidation.message);
    }
  };

  const changePassword = async (payload: ChangePasswordCredentials): Promise<string> => {
    const credentials: ChangePasswordCredentials = {
      ...payload,
    };

    // Validate passwords before making the API call
    validatePasswords(credentials);

    const response = await executePost(credentials);

    if (response?.success) {
      return response.message; // Return the message which contains the email
    }

    throw new Error(response?.message || 'Password change failed');
  };

  return {
    changePassword,
    isLoading,
    isError,
  };
}
