export const PASSWORD_VALIDATION = {
  MIN_LENGTH: 8,
  ERRORS: {
    REQUIRED: 'All password fields are required',
    MISMATCH: 'New password and confirmation do not match',
    SAME_AS_CURRENT: 'New password must be different from current password',
    MIN_LENGTH: 'New password must be at least 8 characters long',
  },
} as const;
