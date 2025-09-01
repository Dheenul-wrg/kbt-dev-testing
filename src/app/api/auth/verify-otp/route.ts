import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import {
  findVerificationToken,
  deleteVerificationToken,
  verifyOtpAndCreateResetToken,
  isTokenExpired,
} from '@/services/verification-service';
import { getTranslations } from 'next-intl/server';

export async function POST(request: NextRequest) {
  const t = await getTranslations();

  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message:
            t('form.email') +
            ' and ' +
            t('verification.otp.label') +
            ' are required',
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const { resetToken } = await verifyOtpAndCreateResetToken(email, otp);

    return NextResponse.json({
      success: true,
      message: t('verification.otp.verified'),
      resetToken,
    });
  } catch (error) {
    console.error('OTP verification error:', error);

    if (error instanceof Error) {
      if (
        error.message === 'OTP has expired' ||
        error.message === 'Token has expired'
      ) {
        return NextResponse.json(
          { success: false, message: t('verification.otp.expired') },
          { status: StatusCodes.BAD_REQUEST }
        );
      } else if (
        error.message === 'Invalid OTP' ||
        error.message === 'Invalid token' ||
        error.message === 'No OTP found'
      ) {
        return NextResponse.json(
          { success: false, message: t('verification.otp.invalid') },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: t('errors.serverError') },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
