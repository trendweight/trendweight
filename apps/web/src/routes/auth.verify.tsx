import { createFileRoute, useNavigate, Link, redirect } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { useAuth } from '../lib/auth/useAuth'
import { supabase } from '../lib/supabase/client'
import { pageTitle } from '../lib/utils/pageTitle'

export const Route = createFileRoute('/auth/verify')({
  // This runs BEFORE the component renders, outside of React's lifecycle
  loader: async ({ location }) => {
    
    // Check if already logged in
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      throw redirect({ to: '/dashboard' })
    }
    
    // Check if this is a Supabase magic link
    const url = new URL(location.href)
    const token = url.searchParams.get('token')
    const type = url.searchParams.get('type')
    
    if (!token || type !== 'email') {
      return { error: 'Invalid login link', needsEmail: false }
    }
    
    // For Supabase, we handle the verification in the component
    return { error: null, needsEmail: false, token }
  },
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const routeData = Route.useLoaderData()
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState('')
  
  const token = routeData.token

  useEffect(() => {
    // If already logged in, redirect
    if (isLoggedIn) {
      navigate({ to: '/dashboard' })
      return
    }

    // If we have a token, verify it
    if (token && isVerifying) {
      (async () => {
        try {
          
          // Supabase will handle the verification automatically when we call getSession
          // after the URL contains the proper parameters
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Error verifying token:', error)
            setError('Invalid or expired login link. Please try logging in again.')
            setIsVerifying(false)
            return
          }
          
          if (data.session) {
            navigate({ to: '/dashboard' })
          } else {
            // Try to exchange the token manually
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href)
            
            if (exchangeError) {
              console.error('Error exchanging code:', exchangeError)
              setError('Invalid or expired login link. Please try logging in again.')
            } else {
              navigate({ to: '/dashboard' })
            }
          }
        } catch (err) {
          console.error('Unexpected error:', err)
          setError('An unexpected error occurred. Please try logging in again.')
        } finally {
          setIsVerifying(false)
        }
      })()
    } else if (!token) {
      setIsVerifying(false)
      setError(routeData.error || 'Invalid login link')
    }
  }, [token, isLoggedIn, navigate, isVerifying, routeData.error])

  return (
    <>
      <title>{pageTitle('Verify Email')}</title>
      <Layout>
        <div className="max-w-md mx-auto text-center">
          {isVerifying ? (
            <>
              <h1 className="text-4xl font-bold mb-4">Verifying...</h1>
              <p className="text-gray-600">Please wait while we verify your login link.</p>
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
    </>
  )
}