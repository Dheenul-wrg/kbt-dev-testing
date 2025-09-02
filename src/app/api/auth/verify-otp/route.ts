import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import {
  findVerificationToken,
  deleteVerificationToken,
  verifyOtpAndCreateResetToken,
  isTokenExpired,
} from '@/services/verification-service';
import { getTranslations } from 'next-intl/server';
import { validateEmail } from '@/utils/validation';

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

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: emailValidation.error || t('form.invalidEmail'),
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate OTP
    if (!otp.trim() || otp.trim().length < 4) {
      return NextResponse.json(
        { success: false, message: 'OTP must be at least 4 characters long' },
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
      return NextResponse.json(
        { success: false, message: error.message },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      { success: false, message: t('errors.serverError') },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
