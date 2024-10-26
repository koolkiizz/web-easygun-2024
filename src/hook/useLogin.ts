import { endpoints } from './api/endpoints';
import { usePost } from './api/fetch';

interface LoginCredentials {
  username: string;
  password: string;
}

interface Server {
  id: number;
  name: string;
  status: string;
  badge: string;
}

interface UserInfo {
  UserID: number;
  UserName: string;
  Email: string;
  Money: string;
  '2fa': string;
  VerifiedEmail: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    userInfo: UserInfo;
    servers: Server[];
  };
}

export function useLogin() {
  const { executePost, isLoading, isError } = usePost<LoginResponse, LoginCredentials>(endpoints.login());

  const login = async (username: string, password: string) => {
    const response = await executePost({ username, password });
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  };

  return {
    login,
    isLoading,
    isError,
  };
}
