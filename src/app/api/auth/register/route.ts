import { NextRequest, NextResponse } from 'next/server';
import { locale } from '@/utils/locale';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: locale.form('allFieldsRequired') },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: locale.form('invalidEmail') },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: locale.form('minPasswordLength') },
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
      { error: locale.errors('registrationNotImplemented') },
      { status: 501 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: locale.errors('serverError') },
      { status: 500 }
    );
  }
}
