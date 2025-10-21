import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { resend } from './resend';
import EmailTemplate from '@/components/email-template';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      const response = await resend.emails.send({
        from: 'project-manager@noreply.franci.dev',
        to: user.email,
        subject: 'Reset your password',
        react: EmailTemplate({ name: user.name, url }),
      });
    },
    resetPasswordTokenExpiresIn: 3600,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
