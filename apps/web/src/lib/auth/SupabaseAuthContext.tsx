import { createContext, useContext, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { supabase } from '../supabase/client'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

interface User {
  uid: string
  email: string | null
  displayName: string | null
}

interface AuthContextType {
  user: User | null
  session: Session | null
  isInitializing: boolean
  isLoggedIn: boolean
  sendLoginEmail: (email: string) => Promise<void>
  completeEmailLogin: (token: string) => Promise<unknown>
  signInWithGoogle: () => Promise<void>
  signInWithMicrosoft: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const SupabaseAuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Transform Supabase user to our User type
  const transformUser = (supabaseUser: SupabaseUser | null): User | null => {
    if (!supabaseUser) return null
    
    return {
      uid: supabaseUser.id,
      email: supabaseUser.email || null,
      displayName: supabaseUser.user_metadata?.name || null,
    }
  }

  // Send login email (magic link)
  const sendLoginEmail = async (email: string) => {
    console.log('Sending login email to:', email)
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify`,
      },
    })
    
    if (error) {
      console.error('Error sending login email:', error)
      throw error
    }
    
    // Save the email locally so we can use it to complete sign-in
    window.localStorage.setItem('emailForSignIn', email)
    console.log('Email saved to localStorage')
  }

  // Complete email link login
  const completeEmailLogin = async (token: string) => {
    console.log('Attempting to complete email login')
    
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    })
    
    if (error) {
      console.error('Error completing email login:', error)
      throw error
    }
    
    console.log('Email sign-in successful, clearing localStorage')
    window.localStorage.removeItem('emailForSignIn')
    return data
  }

  // Social sign-in methods
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    
    if (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signInWithMicrosoft = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'email',
      },
    })
    
    if (error) {
      console.error('Error signing in with Microsoft:', error)
      throw error
    }
  }

  const signInWithApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    
    if (error) {
      console.error('Error signing in with Apple:', error)
      throw error
    }
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Handle auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session ? 'User logged in' : 'User logged out')
      setSession(session)
      setUser(transformUser(session?.user || null))
      setIsInitializing(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session ? 'User logged in' : 'User logged out')
      setSession(session)
      setUser(transformUser(session?.user || null))
    })

    return () => subscription.unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    session,
    isInitializing,
    isLoggedIn: !!user,
    sendLoginEmail,
    completeEmailLogin,
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithApple,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Export hook separately to avoid React Refresh warning
export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}