import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Layout } from '../components/Layout'
import { FaGoogle, FaMicrosoft, FaApple } from 'react-icons/fa'
import { useAuth } from '../lib/auth/AuthContext'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { sendLoginEmail, signInWithGoogle, signInWithMicrosoft, signInWithApple } = useAuth()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    
    setIsSubmitting(true)
    setError('')
    
    try {
      await sendLoginEmail(email)
      navigate({ to: '/check-email', search: { email } })
    } catch (err) {
      console.error('Error sending login email:', err)
      setError('Failed to send login email. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
    setError('')
    
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle()
          break
        case 'microsoft':
          await signInWithMicrosoft()
          break
        case 'apple':
          await signInWithApple()
          break
      }
      // After successful login, redirect to dashboard
      navigate({ to: '/dashboard' })
    } catch (err) {
      console.error(`Error signing in with ${provider}:`, err)
      setError(`Failed to sign in with ${provider}. Please try again.`)
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Log In</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {/* Email login section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your email to log in or create an account
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-600 text-white py-2 px-4 rounded-md hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Email me a login link'}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-50 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social login buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="w-5 h-5 text-red-600" />
            <span>Google</span>
          </button>
          
          <button
            onClick={() => handleSocialLogin('microsoft')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FaMicrosoft className="w-5 h-5 text-blue-600" />
            <span>Microsoft</span>
          </button>
          
          <button
            onClick={() => handleSocialLogin('apple')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FaApple className="w-5 h-5" />
            <span>Apple</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          By continuing, you agree to our{' '}
          <Link to="/privacy" className="text-brand-600 hover:text-brand-700 underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </Layout>
  )
}