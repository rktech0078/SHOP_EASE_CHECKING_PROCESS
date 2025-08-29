import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminClient } from '@/sanity/lib/adminClient';

export async function GET(request: NextRequest) {
  try {
    // Get user session for authentication
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Fetch user profile from Sanity
    const user = await adminClient.fetch(`
      *[_type == "user" && email == $userEmail][0] {
        _id,
        fullName,
        email,
        phone,
        role,
        provider,
        isEmailVerified,
        isPhoneVerified,
        status,
        addresses[] {
          isDefault,
          label,
          fullName,
          phone,
          street,
          city,
          state,
          zipCode,
          country,
          landmark,
          addressType
        },
        createdAt,
        updatedAt,
        lastLogin
      }
    `, { userEmail: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get user session for authentication
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, phone, addresses } = body;

    // Validate required fields
    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Full name and phone are required' },
        { status: 400 }
      );
    }

    // Fetch current user to get their ID
    const currentUser = await adminClient.fetch(`
      *[_type == "user" && email == $userEmail][0] {
        _id
      }
    `, { userEmail: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user profile
    const updatedUser = await adminClient
      .patch(currentUser._id)
      .set({
        fullName: fullName.trim(),
        phone: phone.trim(),
        addresses: addresses || [],
        updatedAt: new Date().toISOString()
      })
      .commit();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
