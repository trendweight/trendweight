import { getApps, initializeApp } from 'firebase/app'
import { 
  getAuth, 
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Check if all required config values are present
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Missing required Firebase configuration. Please check environment variables.')
  console.error('Config:', firebaseConfig)
} else {
  console.log('Firebase initialized with project:', firebaseConfig.projectId)
}

// Initialize Firebase app if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig)
}

// Export auth instance and functions
export const auth = getAuth()

// Auth providers
export const googleProvider = new GoogleAuthProvider()
export const microsoftProvider = new OAuthProvider('microsoft.com')
export const appleProvider = new OAuthProvider('apple.com')

// Export Firebase auth functions for use in the app
export {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  type User
}