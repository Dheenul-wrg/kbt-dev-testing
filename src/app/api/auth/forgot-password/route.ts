import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '@/services/user-service';
import { EmailService } from '@/services/email-service';
import {
  generateOtp,
  calculateOtpExpiry,
  createOtpToken,
} from '@/services/verification-service';
import { getTranslations } from 'next-intl/server';
import { OTP_EXPIRATION_MINUTES } from '@/constants/auth';
import { validateEmail } from '@/utils/validation';

export async function POST(request: NextRequest) {
  const t = await getTranslations();

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: t('form.email') + ' ' + t('form.required') },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Use centralized email validation
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

    const user = await UserService.findByEmail(email);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: t('form.invalidEmail'),
      });
    }
    const otp = generateOtp();
    const otpExpiry = calculateOtpExpiry(OTP_EXPIRATION_MINUTES);

    await createOtpToken(email, otp, otpExpiry);

    try {
      await EmailService.sendOtpEmail(email, otp);
    } catch (emailError) {
      return NextResponse.json({
        success: false,
        message: t('verification.otp.sentGeneric'),
      });
    }

    return NextResponse.json({
      success: true,
      message: t('verification.otp.sentGeneric'),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: t('errors.serverError') },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
