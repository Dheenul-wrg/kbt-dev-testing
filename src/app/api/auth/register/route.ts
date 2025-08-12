import { NextRequest, NextResponse } from 'next/server';
import { FORM_MESSAGES, ERROR_MESSAGES } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: FORM_MESSAGES.ALL_FIELDS_REQUIRED },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: FORM_MESSAGES.INVALID_EMAIL },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: FORM_MESSAGES.MIN_PASSWORD_LENGTH },
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
      { error: ERROR_MESSAGES.REGISTRATION_NOT_IMPLEMENTED },
      { status: 501 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}
