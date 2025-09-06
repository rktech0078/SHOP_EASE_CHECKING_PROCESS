import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { adminClient } from '@/sanity/lib/adminClient'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          // Fetch user from Sanity
          const user = await adminClient.fetch(`
            *[_type == "user" && email == $email][0] {
              _id,
              fullName,
              email,
              password,
              role,
              provider,
              isEmailVerified,
              status,
              lastLogin
            }
          `, { email: credentials.email.toLowerCase() })

          if (!user) {
            throw new Error('User not found')
          }

          if (user.status !== 'active') {
            throw new Error('Account is not active')
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          // Update last login
          await adminClient
            .patch(user._id)
            .set({ lastLogin: new Date().toISOString() })
            .commit()

          return {
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role || 'customer',
            provider: user.provider || 'credentials',
            isEmailVerified: user.isEmailVerified || false
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw new Error('Authentication failed')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google' || account?.provider === 'facebook') {
          const email = profile?.email || user.email
          if (!email) return false

          // Check if user exists
          const existingUser = await adminClient.fetch(`
            *[_type == "user" && email == $email][0] {
              _id,
              fullName,
              email,
              role,
              provider,
              lastLogin
            }
          `, { email: email.toLowerCase() })

          if (existingUser) {
            // Update existing user
            await adminClient
              .patch(existingUser._id)
              .set({ 
                lastLogin: new Date().toISOString(),
                provider: account.provider,
                updatedAt: new Date().toISOString()
              })
              .commit()
          } else {
            // Create new user
            const newUser = {
              _type: 'user',
              fullName: profile?.name || user.name || 'Unknown User',
              email: email.toLowerCase(),
              role: 'customer',
              provider: account.provider,
              isEmailVerified: true,
              isPhoneVerified: false,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              addresses: []
            }
            await adminClient.create(newUser)
          }
        }
        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as unknown as Record<string, unknown>).role as string || 'customer'
        token.id = (user as unknown as Record<string, unknown>).id as string
        token.provider = account?.provider || 'credentials'
        token.isEmailVerified = (user as unknown as Record<string, unknown>).isEmailVerified as boolean || false
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as Record<string, unknown>).role = token?.role ?? 'customer'
        ;(session.user as Record<string, unknown>).id = token?.id ?? ''
        ;(session.user as Record<string, unknown>).provider = token?.provider ?? 'credentials'
        ;(session.user as Record<string, unknown>).isEmailVerified = token?.isEmailVerified ?? false
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs and same-origin URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET!,
  debug: process.env.NODE_ENV === 'development',
}
