import { prisma } from '@/repository/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { UserService } from './user-service';

import {
  OTP_EXPIRATION_MINUTES,
  RESET_TOKEN_EXPIRY_MINUTES,
  OTP_MIN_VALUE,
  OTP_MAX_VALUE,
} from '@/constants/auth';
const RESET_TOKEN_BYTES = 32;

export function generateResetToken(): string {
  return crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex');
}

export function calculateExpiryTime(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export async function findVerificationToken(email: string, token: string) {
  // Get only the latest token for this email and purpose
  const latestToken = await prisma.twoFactorCode.findFirst({
    where: {
      sent_to: email,
      purpose: 'reset_password',
    },
    orderBy: {
      created_at: 'desc', // Get the most recent one
    },
  });

  if (!latestToken) {
    return null;
  }

  // Check if the token matches the hashed version
  const isValid = await bcrypt.compare(token, latestToken.code_hash);
  return isValid ? latestToken : null;
}

// Helper function to verify and get token with expiration check
export async function verifyAndGetToken(
  email: string,
  token: string,
  checkExpiry: boolean = true
) {
  const tokenRecord = await findVerificationToken(email, token);

  if (!tokenRecord) {
    throw new Error('Invalid token');
  }

  if (checkExpiry && isTokenExpired(tokenRecord.expires_at)) {
    throw new Error('Token has expired');
  }

  return tokenRecord;
}

export async function createVerificationToken(
  email: string,
  token: string,
  expires: Date
) {
  // First, get the user to get the user_id
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Hash the token before storing
  const hashedToken = await bcrypt.hash(token, 10);

  return await prisma.twoFactorCode.create({
    data: {
      user_id: user.user_id,
      method: 'email',
      purpose: 'reset_password',
      code_hash: hashedToken, // Store hashed token
      expires_at: expires,
      sent_to: email,
      status: 'success',
    },
  });
}

/**
 * Delete verification token by ID - secure method that requires the token ID
 * This should be called after verifying the token to get its ID
 * @param tokenId - The database ID of the token to delete
 */
export async function deleteVerificationTokenById(tokenId: number) {
  return await prisma.twoFactorCode.delete({
    where: { id: tokenId },
  });
}

/**
 * @deprecated Use deleteVerificationTokenById instead for better security
 * This function performs expensive bcrypt operations and should be avoided
 */
export async function deleteVerificationToken(email: string, token: string) {
  // Find the specific token for this email (much more efficient)
  const tokenRecord = await findVerificationToken(email, token);

  if (!tokenRecord) {
    return null;
  }

  return await prisma.twoFactorCode.delete({
    where: { id: tokenRecord.id },
  });
}

export async function verifyOtpAndCreateResetToken(email: string, otp: string) {
  const resetToken = generateResetToken();
  const resetTokenExpiry = calculateExpiryTime(RESET_TOKEN_EXPIRY_MINUTES);

  // Get the user to get the user_id
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Hash the reset token
  const hashedResetToken = await bcrypt.hash(resetToken, 10);

  await prisma.$transaction(async tx => {
    // Create new reset token
    await tx.twoFactorCode.create({
      data: {
        user_id: user.user_id,
        method: 'email',
        purpose: 'reset_password',
        code_hash: hashedResetToken, // Store hashed reset token
        expires_at: resetTokenExpiry,
        sent_to: email,
        status: 'success',
      },
    });

    // Verify and delete the OTP token
    const otpToken = await verifyAndGetToken(email, otp, true); // Check expiry
    await tx.twoFactorCode.delete({
      where: { id: otpToken.id },
    });
  });

  return { resetToken, resetTokenExpiry };
}

export function isTokenExpired(expires: Date): boolean {
  return expires < new Date();
}

export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'verification.password.tooShort',
    };
  }

  return { isValid: true };
}

export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function calculateOtpExpiry(
  minutes: number = OTP_EXPIRATION_MINUTES
): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export async function createOtpToken(
  email: string,
  otp: string,
  expires: Date
) {
  // First, get the user to get the user_id
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Hash the OTP before storing
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Use transaction to ensure atomicity
  return await prisma.$transaction(async tx => {
    // Clean up old OTPs for this user
    await tx.twoFactorCode.deleteMany({
      where: {
        user_id: user.user_id,
        purpose: 'reset_password',
      },
    });

    // Create new OTP
    return await tx.twoFactorCode.create({
      data: {
        user_id: user.user_id,
        method: 'email',
        purpose: 'reset_password',
        code_hash: hashedOtp, // Store hashed OTP
        expires_at: expires,
        sent_to: email,
        status: 'success',
      },
    });
  });
}

export async function resetPasswordWithToken(
  email: string,
  resetToken: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify and get the reset token with expiry check
    const verificationToken = await verifyAndGetToken(email, resetToken, true);

    const passwordUpdated = await UserService.updatePassword(
      email,
      newPassword
    );

    if (!passwordUpdated) {
      return { success: false, message: 'verification.password.updateFailed' };
    }

    // Delete the used reset token by ID (secure method - no additional bcrypt operations)
    await deleteVerificationTokenById(verificationToken.id);

    return { success: true, message: 'verification.password.resetSuccess' };
  } catch (error) {
    console.error('Password reset error:', error);

    if (error instanceof Error) {
      if (error.message === 'Token has expired') {
        return { success: false, message: 'verification.token.expired' };
      } else if (error.message === 'Invalid token') {
        return { success: false, message: 'verification.token.invalid' };
      }
    }

    return { success: false, message: 'verification.error.general' };
  }
}
