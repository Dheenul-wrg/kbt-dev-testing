import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { resetPasswordWithToken } from '@/services/verification-service';
import { getTranslations } from 'next-intl/server';
import { validateEmail, validatePassword } from '@/utils/validation';

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
    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: emailValidation.error || 'Invalid email address',
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: passwordValidation.error || 'Invalid password',
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate resetToken
    if (!resetToken || resetToken.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Reset token is required' },
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
