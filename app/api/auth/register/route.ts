import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/sanity/lib/client'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone, address } = await request.json()

    // Validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

                // Check if user already exists
            const existingUser = await adminClient.fetch(
              `*[_type == "user" && email == $email][0]`,
              { email }
            )

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Generate verification token
    const verificationToken = uuidv4()

                // Create user
            const user = await adminClient.create({
              _type: 'user',
              email,
              password: hashedPassword,
              fullName,
              phone: phone || '',
              address: address || {},
              role: 'customer',
              isVerified: false,
              verificationToken,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })

                // Remove sensitive data from response
            const { password: _, verificationToken: __, ...userWithoutSensitiveData } = user

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutSensitiveData
      },
      { status: 201 }
    )

            } catch (error: unknown) {
            console.error('Registration error:', error)
            
            // Handle specific Sanity errors
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage.includes('Insufficient permissions')) {
              return NextResponse.json(
                { error: 'Server configuration error. Please contact administrator.' },
                { status: 500 }
              )
            }
            
            if (errorMessage.includes('duplicate key')) {
              return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
              )
            }
            
            return NextResponse.json(
              { error: errorMessage || 'Internal server error' },
              { status: 500 }
            )
          }
}
