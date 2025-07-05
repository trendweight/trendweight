import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export interface User {
  uid: string
  email: string | null
  displayName: string | null
}

export interface AuthContextType {
  user: User | null
  session: Session | null
  isInitializing: boolean
  isLoggedIn: boolean
  sendLoginEmail: (email: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithMicrosoft: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)