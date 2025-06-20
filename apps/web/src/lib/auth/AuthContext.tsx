import { createContext, useContext, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import {
  auth,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  googleProvider,
  microsoftProvider,
  appleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from '../firebase'

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

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Action code settings for email link authentication
  const actionCodeSettings = {
    // URL must be in the authorized domains list in Firebase Console
    url: `${window.location.origin}/auth/verify`,
    handleCodeInApp: true,
  }

  // Send login email
  const sendLoginEmail = async (email: string) => {
    console.log('Sending login email to:', email)
    console.log('Action code settings:', actionCodeSettings)
    
    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    // Save the email locally so we can use it to complete sign-in
    window.localStorage.setItem('emailForSignIn', email)
    console.log('Email saved to localStorage')
  }

  // Complete email link login
  const completeEmailLogin = async (email: string, emailLink: string) => {
    console.log('Attempting to complete email login for:', email)
    const result = await signInWithEmailLink(auth, email, emailLink)
    console.log('Email sign-in successful, clearing localStorage')
    window.localStorage.removeItem('emailForSignIn')
    return result
  }

  // Social sign-in methods
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const signInWithMicrosoft = async () => {
    await signInWithPopup(auth, microsoftProvider)
  }

  const signInWithApple = async () => {
    await signInWithPopup(auth, appleProvider)
  }

  // Sign out
  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out')
      
      if (firebaseUser) {
        const { uid, email, displayName } = firebaseUser
        console.log('User details:', { uid, email, displayName })
        setUser({ uid, email, displayName })
        
        // Get the ID token for API authentication
        // const token = await firebaseUser.getIdToken()
        // TODO: Set up API authentication with token
      } else {
        setUser(null)
      }
      setIsInitializing(false)
    })

    return () => unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
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
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}