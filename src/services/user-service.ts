import { prisma } from '@/repository/prisma';
import bcrypt from 'bcryptjs';

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
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
  userId: number;
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
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  user_id: number;
  email: string;
  password_hash?: string | null;
  email_verified?: boolean;
  role_id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  accounts?: Account[];
}

export class UserService {
  /**
   * Get or create default role
   */
  private static async getOrCreateDefaultRole() {
    try {
      // Try to find existing default role
      let defaultRole = await prisma.role.findFirst({
        where: { role_name: 'user' },
      });

      if (!defaultRole) {
        // Create default role if it doesn't exist
        defaultRole = await prisma.role.create({
          data: {
            role_name: 'user',
            status: 'active',
          },
        });
      }

      return defaultRole;
    } catch (error) {
      console.error('Error getting or creating default role:', error);
      throw error;
    }
  }

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
      throw error;
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
      throw error;
    }
  }

  /**
   * Create user with credentials (email/password)
   */
  static async createUserWithCredentials(
    userData: CreateUserData
  ): Promise<User> {
    try {
      if (!userData.password) {
        throw new Error('Password is required for credentials user');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Get or create default role before creating user
      const defaultRole = await this.getOrCreateDefaultRole();

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password_hash: hashedPassword,
          role_id: defaultRole.role_id,
          status: 'active',
        },
      });

      return user;
    } catch (error) {
      console.error('Error creating user with credentials:', error);
      throw error;
    }
  }

  /**
   * Create or update user for OAuth provider
   */
  static async createOrUpdateOAuthUser(userData: OAuthUserData): Promise<User> {
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
              userId: user.user_id,
              type: 'oauth',
              provider: userData.provider,
              providerAccountId: userData.providerAccountId,
              status: 'active',
            },
          });
        }

        user = await prisma.user.update({
          where: { user_id: user.user_id },
          data: {
            updated_at: new Date(),
          },
        });

        return user!;
      }

      // Get or create default role before creating user
      const defaultRole = await this.getOrCreateDefaultRole();

      user = await prisma.user.create({
        data: {
          email: userData.email,
          password_hash: null,
          role_id: defaultRole.role_id,
          status: 'active',
          accounts: {
            create: {
              type: 'oauth',
              provider: userData.provider,
              providerAccountId: userData.providerAccountId,
              status: 'active',
            },
          },
        },
      });

      return user!;
    } catch (error) {
      console.error('Error creating/updating OAuth user:', error);
      throw error;
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

      if (!user || !user.password_hash) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        return null;
      }

      return user!;
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(
    userId: number,
    updateData: Partial<CreateUserData>
  ): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { user_id: userId },
        data: {
          ...updateData,
          updated_at: new Date(),
        },
      });

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user and all related data
   */
  static async deleteUser(userId: number): Promise<void> {
    try {
      await prisma.user.delete({
        where: { user_id: userId },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Get user with all accounts
   */
  static async getUserWithAccounts(userId: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: {
          accounts: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Error getting user with accounts:', error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(
    email: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { email },
        data: {
          password_hash: hashedPassword,
          updated_at: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }

  /**
   * Check if user can use credentials login
   */
  static async canUseCredentials(email: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);
      return user ? !!user.password_hash : false;
    } catch (error) {
      console.error('Error checking credentials capability:', error);
      return false;
    }
  }
}
