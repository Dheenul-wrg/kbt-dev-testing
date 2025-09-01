import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import { UserService } from '@/services/user-service';
import type { NextAuthOptions } from 'next-auth';

// Ensure we have a secret for NextAuth
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || ' ';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    // Facebook provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),

    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await UserService.verifyPassword(
            credentials.email,
            credentials.password
          );

          if (user) {
            return {
              id: user.user_id,
              email: user.email,
              name: user.email, // User model doesn't have name field, using email as fallback
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  // Custom pages
  pages: {
    signIn: '/auth/login',
  },
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') {
        return true;
      }

      // Handle OAuth providers (Google, Facebook, Apple)
      if (account && profile && user.email) {
        try {
          const userData = {
            email: user.email,
            name: user.name || profile.name || profile.email || user.email,
            image: user.image,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          };
          const dbUser = await UserService.createOrUpdateOAuthUser(userData);

          if (dbUser) {
            user.id = dbUser.user_id;
            return true;
          }

          return false;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id.toString();
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },
};
