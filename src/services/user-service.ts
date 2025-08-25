import { prisma } from '@/repository/prisma';
import bcrypt from 'bcryptjs';

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
  image?: string | null;
}

export interface OAuthUserData {
  email: string;
  name: string;
  image?: string | null;
  provider: string;
  providerAccountId: string;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  accounts?: Account[];
}

export class UserService {
  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          accounts: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Find user by OAuth provider account
   */
  static async findByOAuthAccount(
    provider: string,
    providerAccountId: string
  ): Promise<User | null> {
    try {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: {
          user: true,
        },
      });
      return account?.user || null;
    } catch (error) {
      console.error('Error finding user by OAuth account:', error);
      return null;
    }
  }

  /**
   * Create user with credentials (email/password)
   */
  static async createUserWithCredentials(
    userData: CreateUserData
  ): Promise<User | null> {
    try {
      if (!userData.password) {
        throw new Error('Password is required for credentials user');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          image: userData.image,
        },
      });

      return user;
    } catch (error) {
      console.error('Error creating user with credentials:', error);
      return null;
    }
  }

  /**
   * Create or update user for OAuth provider
   */
  static async createOrUpdateOAuthUser(
    userData: OAuthUserData
  ): Promise<User | null> {
    try {
      let user = await this.findByEmail(userData.email);

      if (user) {
        const existingAccount = user.accounts?.find(
          (account: Account) =>
            account.provider === userData.provider &&
            account.providerAccountId === userData.providerAccountId
        );

        if (!existingAccount) {
          // Link new OAuth account to existing user
          await prisma.account.create({
            data: {
              userId: user.id,
              type: 'oauth',
              provider: userData.provider,
              providerAccountId: userData.providerAccountId,
            },
          });
        }
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: userData.name || user.name,
            image: userData.image || user.image,
            updatedAt: new Date(),
          },
        });

        return user;
      }

      user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          image: userData.image,
          accounts: {
            create: {
              type: 'oauth',
              provider: userData.provider,
              providerAccountId: userData.providerAccountId,
            },
          },
        },
      });

      return user;
    } catch (error) {
      console.error('Error creating/updating OAuth user:', error);
      return null;
    }
  }

  /**
   * Verify password for credentials user
   */
  static async verifyPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    try {
      const user = await this.findByEmail(email);

      if (!user || !user.password) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error verifying password:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(
    userId: string,
    updateData: Partial<CreateUserData>
  ): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  /**
   * Delete user and all related data
   */
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  /**
   * Get user with all accounts
   */
  static async getUserWithAccounts(userId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          accounts: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Error getting user with accounts:', error);
      return null;
    }
  }
}
