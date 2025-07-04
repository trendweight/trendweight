import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from './UnifiedAuthContext'
import { authSuspenseManager } from './authSuspense'

export function useRequireAuth() {
  const auth = useAuth()
  const navigate = useNavigate()

  // If auth is still initializing, throw a promise for Suspense
  if (auth.isInitializing) {
    throw authSuspenseManager.getPromise()
  }

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!auth.user) {
      navigate({ to: '/login' })
    }
  }, [auth.user, navigate])

  // Return the full auth object so components have access to everything
  return auth
}