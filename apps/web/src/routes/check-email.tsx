import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { HiOutlineMail } from 'react-icons/hi'
import { useAuth } from '../lib/auth/useAuth'

export const Route = createFileRoute('/check-email')({
  component: CheckEmailPage,
})

function CheckEmailPage() {
  const { sendLoginEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(30)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get email from URL params
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleResend = async () => {
    if (!canResend || isResending || !email) return
    
    setIsResending(true)
    setError('')
    
    try {
      await sendLoginEmail(email)
      setIsResending(false)
      setCanResend(false)
      setResendCountdown(30)
      
      // Restart countdown
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      console.error('Error resending login email:', err)
      setError('Failed to resend email. Please try again.')
      setIsResending(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex bg-brand-100 text-brand-600 items-center justify-center p-4 rounded-full mb-6">
          <HiOutlineMail className="h-8 w-8" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Check your email!</h1>
        
        <p className="text-lg text-gray-600 mb-2">
          We sent a login link to
        </p>
        
        <p className="text-lg font-medium mb-8">
          {email || 'your email address'}
        </p>
        
        <p className="text-gray-600 mb-8">
          Open the link in your email to continue. This link will expire in 1 hour.
        </p>
        
        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}
        
        {!canResend ? (
          <p className="text-sm text-gray-500">
            Didn't get it? You can request a new link in {resendCountdown} seconds
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-brand-600 hover:text-brand-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? 'Sending...' : 'Send again'}
          </button>
        )}
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Wrong email?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 underline">
              Try again
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}