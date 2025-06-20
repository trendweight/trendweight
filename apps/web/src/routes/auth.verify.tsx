import { createFileRoute, useNavigate, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../lib/auth/AuthContext'
import { auth, isSignInWithEmailLink, signInWithEmailLink } from '../lib/firebase'

export const Route = createFileRoute('/auth/verify')({
  // This runs BEFORE the component renders, outside of React's lifecycle
  loader: async ({ location }) => {
    console.log('loader: Checking email verification link')
    
    // Check if already logged in
    if (auth.currentUser) {
      console.log('loader: User already logged in, redirecting')
      throw redirect({ to: '/dashboard' })
    }
    
    // Check if this is a valid email link
    if (!isSignInWithEmailLink(auth, location.href)) {
      console.log('loader: Not a valid email link')
      return { error: 'Invalid login link', needsEmail: false }
    }
    
    // Get email from localStorage
    const email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      console.log('loader: No email in localStorage, need to ask user')
      return { error: null, needsEmail: true }
    }
    
    // Try to sign in
    try {
      console.log('loader: Attempting sign in with email link')
      await signInWithEmailLink(auth, email, location.href)
      window.localStorage.removeItem('emailForSignIn')
      console.log('loader: Sign in successful, redirecting')
      throw redirect({ to: '/dashboard' })
    } catch (error) {
      console.error('loader: Sign in failed', error)
      
      // Check if it's a Firebase auth error
      const authError = error as { code?: string }
      
      // If already signed in despite error, redirect
      if (auth.currentUser) {
        throw redirect({ to: '/dashboard' })
      }
      
      // If the error is specifically about invalid action code, provide a better message
      if (authError.code === 'auth/invalid-action-code') {
        return { 
          error: 'This login link has already been used or has expired. Please request a new one.', 
          needsEmail: false 
        }
      }
      
      return { 
        error: 'Invalid or expired login link. Please try logging in again.', 
        needsEmail: false 
      }
    }
  },
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const navigate = useNavigate()
  const { completeEmailLogin } = useAuth()
  const routeData = Route.useLoaderData()
  const [emailInput, setEmailInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  
  // Get data from the route loader
  const error = routeData.error || ''
  const needsEmail = routeData.needsEmail || false

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      await completeEmailLogin(emailInput, window.location.href)
      navigate({ to: '/dashboard' })
    } catch (error) {
      console.error('Error completing email login:', error)
      setSubmitError('Invalid or expired login link. Please try logging in again.')
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto text-center">
        {needsEmail ? (
          <>
            <h1 className="text-4xl font-bold mb-4">Confirm Your Email</h1>
            <p className="text-gray-600 mb-6">
              For security reasons, please confirm the email address you used to request this login link.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-600 text-white py-2 px-4 rounded-md hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing in...' : 'Complete Sign In'}
              </button>
            </form>
            {submitError && <p className="text-red-600 mt-4">{submitError}</p>}
          </>
        ) : error ? (
          <>
            <h1 className="text-4xl font-bold mb-4">Verification Failed</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Link to="/login" className="text-brand-600 hover:text-brand-700 underline">
              Return to login
            </Link>
          </>
        ) : (
          // This shouldn't happen, but just in case
          <>
            <h1 className="text-4xl font-bold mb-4">Processing...</h1>
            <p className="text-gray-600">Please wait...</p>
          </>
        )}
      </div>
    </Layout>
  )
}