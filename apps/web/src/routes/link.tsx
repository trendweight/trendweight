import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { useRequireAuth } from '../lib/auth/useRequireAuth'
import { apiRequest } from '../lib/api/client'
import { useState } from 'react'
import { useDocumentTitle } from '../lib/hooks/useDocumentTitle'

export const Route = createFileRoute('/link')({
  component: LinkPage,
})

function LinkPage() {
  useRequireAuth()
  useDocumentTitle('Link Accounts')
  const [isLoading, setIsLoading] = useState(false)

  const handleLinkWithings = async () => {
    setIsLoading(true)
    try {
      const response = await apiRequest<{ authorizationUrl: string }>('/withings/link')
      window.location.assign(response.authorizationUrl)
    } catch (error) {
      console.error('Error getting Withings authorization URL:', error)
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div>
        <h1 className="text-4xl font-bold mb-4">Link Provider Account</h1>
        <p className="text-lg text-gray-600 mb-4">
          Connect your Withings or Fitbit account to start tracking your weight trends.
        </p>
        
        <div className="bg-white shadow rounded-lg p-6">
          <button
            onClick={handleLinkWithings}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Link Withings Account'}
          </button>
        </div>
      </div>
    </Layout>
  )
}