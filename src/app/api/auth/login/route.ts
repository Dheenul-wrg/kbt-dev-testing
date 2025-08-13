import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { StatusCodes } from 'http-status-codes';
import { sendErrorAlert } from '@/services';

export async function POST(request: NextRequest) {
  const t = await getTranslations();
  let email: string | undefined;

  try {
    const body = await request.json();
    const { email: userEmail, password } = body;
    email = userEmail;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: t('form.allFieldsRequired') },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // write login logic here
    return NextResponse.json(
      { message: t('success.loginSuccess') },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error('Login error:', error);

    // Send error to Slack
    await sendErrorAlert(error as Error, {
      user: email || 'unknown',
      action: 'User Login',
      url: request.url,
    });

    return NextResponse.json(
      { error: t('errors.serverError') },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
