import { createContext, useContext } from 'react'
import type { FC, ReactNode } from 'react'
import { SupabaseAuthProvider, useSupabaseAuth } from './SupabaseAuthContext'

interface User {
  uid: string
  email: string | null
  displayName: string | null
}

interface AuthContextType {
  user: User | null
  isInitializing: boolean
  isLoggedIn: boolean
  sendLoginEmail: (email: string) => Promise<void>
  completeEmailLogin: (email: string, emailLink: string) => Promise<unknown>
  signInWithGoogle: () => Promise<void>
  signInWithMicrosoft: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Bridge component that adapts Supabase auth to the existing interface
const UnifiedAuthBridge: FC<{ children: ReactNode }> = ({ children }) => {
  const supabaseAuth = useSupabaseAuth()
  
  // Adapt the completeEmailLogin method to match the existing interface
  const completeEmailLogin = async (_email: string, emailLink: string) => {
    // Extract the token from the email link
    const url = new URL(emailLink)
    const token = url.searchParams.get('token') || url.searchParams.get('access_token') || ''
    
    return supabaseAuth.completeEmailLogin(token)
  }
  
  const value: AuthContextType = {
    ...supabaseAuth,
    completeEmailLogin,
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Main provider that wraps everything
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SupabaseAuthProvider>
      <UnifiedAuthBridge>{children}</UnifiedAuthBridge>
    </SupabaseAuthProvider>
  )
}

// Export the hook with the same name as the existing one
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}