export const endpoints = {
  login: () => `/loginWeb`,
  changePassword: () => `/changePassword`,
  register: () => `/register`,
  requestVerifyEmail: () => `/verifyEmail`,
  verifyEmail: () => `/validateVerifyEmail`,
  requestDuplicateVerify: () => `/active2fa`,
  duplicateVerify: () => `/validate2fa`,
  validateLogin: () => `/login/validatetfa`,
  acb: () => `/getBankQrCode`,
  mb: () => `/getMBBankQrCode`,
  servers: () => `/serverlist`,
};
