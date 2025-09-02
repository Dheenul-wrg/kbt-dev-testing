import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import {
  resetPasswordWithToken,
  validatePassword,
} from '@/services/verification-service';
import { getTranslations } from 'next-intl/server';

export async function POST(request: NextRequest) {
  const t = await getTranslations();

  try {
    const body = await request.json();
    const { email, resetToken, newPassword } = body;

    if (!email || !resetToken || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: t('form.allFieldsRequired'),
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: t(passwordValidation.message!),
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const result = await resetPasswordWithToken(email, resetToken, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: t(result.message) },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    return NextResponse.json({
      success: true,
      message: t(result.message),
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { success: false, message: t('errors.serverError') },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
