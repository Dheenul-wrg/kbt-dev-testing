import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

export async function POST(request: NextRequest) {
  const t = await getTranslations();

  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: t('form.allFieldsRequired') },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: t('form.invalidEmail') },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: t('form.minPasswordLength', { min: 6 }) },
        { status: 400 }
      );
    }

    // TODO: Implement actual user registration logic
    // - Check if user already exists
    // - Hash password
    // - Create user in database
    // - Generate JWT token
    // - Return user data and token

    return NextResponse.json(
      { error: t('errors.registrationNotImplemented') },
      { status: 501 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: t('errors.serverError') },
      { status: 500 }
    );
  }
}
