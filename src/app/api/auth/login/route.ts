import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

export async function POST(request: NextRequest) {
  const t = await getTranslations();

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: t('form.allFieldsRequired') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: t('errors.authenticationNotImplemented') },
      { status: 501 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: t('errors.serverError') },
      { status: 500 }
    );
  }
}
