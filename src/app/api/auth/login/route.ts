import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: NextRequest) {
  const t = await getTranslations();

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: t('form.allFieldsRequired') },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // write login logic here
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: t('errors.serverError') },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
