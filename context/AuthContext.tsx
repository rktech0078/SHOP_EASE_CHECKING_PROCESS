'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
  image?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (profileData: ProfileData) => Promise<{ success: boolean; error?: string }>
}

interface RegisterData {
  email: string
  password: string
  fullName: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
}

interface ProfileData {
  fullName?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      // This will be handled by individual components
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      setUser({
        id: (session.user as any).id || '',
        email: session.user.email as string,
        name: session.user.name as string,
        role: (session.user as any).role || 'customer',
        image: session.user.image as string,
      })
    } else {
      setUser(null)
    }

    setIsLoading(false)
  }, [session, status])

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        // Handle specific NextAuth errors
        let errorMessage = 'Login failed'
        
        if (result.error === 'CredentialsSignin') {
          errorMessage = 'Invalid email or password'
        } else if (result.error === 'Configuration') {
          errorMessage = 'Server configuration error'
        } else if (result.error === 'AccessDenied') {
          errorMessage = 'Access denied'
        } else {
          errorMessage = result.error
        }
        
        return { success: false, error: errorMessage }
      }

      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' }
      }

      return { success: true }
    } catch (error: any) {
      console.error('Registration error:', error)
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    signOut({ callbackUrl: '/' })
  }

  const updateProfile = async (profileData: ProfileData) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Profile update failed' }
      }

      // Update local user state
      if (user) {
        setUser({
          ...user,
          name: profileData.fullName || user.name,
        })
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Profile update failed' }
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
