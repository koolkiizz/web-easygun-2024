export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Server {
  id: number;
  name: string;
  status: string;
  badge: string;
}

export interface UserInfo {
  UserID: number;
  UserName: string;
  Email: string;
  Money: string;
  '2fa': string;
  VerifiedEmail: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userInfo: UserInfo;
  servers: Server[];
}

export interface ChangePasswordCredentials {
  current_password: string;
  new_password: string;
  re_new_password: string;
}
