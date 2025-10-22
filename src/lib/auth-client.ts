import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
  resetPassword,
  forgetPassword,
  sendVerificationEmail,
} = authClient;
