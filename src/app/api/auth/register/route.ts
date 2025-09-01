import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '@/services/user-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validate input - email and password are required, firstName/lastName are optional
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Check if user already exists using UserService
    const existingUser = await UserService.findByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: StatusCodes.CONFLICT }
      );
    }

    // Create user using UserService
    const user = await UserService.createUserWithCredentials({
      email,
      name:
        firstName && lastName
          ? `${firstName} ${lastName}`
          : email.split('@')[0], // Use email prefix if no name provided
      password,
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }

    // Return success response (NextAuth will handle session creation on login)
    return NextResponse.json({
      success: true,
      user: {
        id: user.user_id.toString(),
        email: user.email,
        name: user.email,
      },
      message: 'Registration successful. Please login.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
