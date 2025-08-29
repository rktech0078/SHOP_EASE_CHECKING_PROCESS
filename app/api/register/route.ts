import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { adminClient } from '@/sanity/lib/adminClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, phone } = body;

    // Validate required fields
    if (!fullName || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    const existingUserByEmail = await adminClient.fetch(`
      *[_type == "user" && email == $email][0] {
        _id,
        email
      }
    `, { email: email.toLowerCase().trim() });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Check if phone number is already taken
    const existingUserByPhone = await adminClient.fetch(`
      *[_type == "user" && phone == $phone][0] {
        _id,
        phone
      }
    `, { phone: phone.trim() });

    if (existingUserByPhone) {
      return NextResponse.json(
        { error: 'An account with this phone number already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user document
    const user = {
      _type: 'user',
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: 'customer',
      provider: 'credentials',
      isEmailVerified: false,
      isPhoneVerified: false,
      status: 'active',
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Save user to Sanity
    const result = await adminClient.create(user);

    // Return success response (without sensitive data)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: result._id,
        fullName: result.fullName,
        email: result.email,
        role: result.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific Sanity errors
    if (error && typeof error === 'object' && 'message' in error) {
      if (error.message.includes('Insufficient permissions')) {
        return NextResponse.json(
          { error: 'Database access error. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
