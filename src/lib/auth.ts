import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { resend } from './resend';
import ResetPasswordEmailTemplate from '@/components/email/ResetPasswordEmailTemplate';
import VerifyEmailTemplate from '@/components/email/VerifyEmailTemplate';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'project-manager@noreply.franci.dev',
        to: user.email,
        subject: 'Reset your password',
        react: ResetPasswordEmailTemplate({ name: user.name, url }),
      });
    },
  },
  resetPasswordTokenExpiresIn: 3600,
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'project-manager@noreply.franci.dev',
        to: user.email,
        subject: 'Verify your email',
        react: VerifyEmailTemplate({ name: user.name, url }),
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
