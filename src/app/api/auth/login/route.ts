import { NextRequest, NextResponse } from 'next/server';
import { FORM_MESSAGES, ERROR_MESSAGES } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: FORM_MESSAGES.ALL_FIELDS_REQUIRED },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.AUTHENTICATION_NOT_IMPLEMENTED },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}
