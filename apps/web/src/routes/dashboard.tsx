import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { useTestData, useSettings } from '../lib/api/queries'
import { useAuth } from '../lib/auth/AuthContext'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  // Get authentication state
  const { isInitializing } = useAuth()
  
  // Only fetch data when auth is initialized
  const { data: testData } = useTestData({
    // This will prevent the query from running until auth is initialized
    enabled: !isInitializing
  })

  const { data: settingsData, isError, error } = useSettings({
    // This will prevent the query from running until auth is initialized
    enabled: !isInitializing
  })

  return (
    <Layout>
      <div>
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-4">
          Welcome to your dashboard! Weight tracking features coming soon.
        </p>
        
        {/* Auth Test Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication Test</h2>
          
          {testData && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
              <p className="font-medium">Authentication successful!</p>
              <pre className="mt-2 bg-green-100 p-2 rounded overflow-x-auto">
                <code>
                  {JSON.stringify(testData, null, 2)}
                </code>
              </pre>
            </div>
          )}
        </div>
        
        {/* Settings API Test Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">User Settings</h2>
          
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              <p className="font-medium">Error fetching settings:</p>
              <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          )}
          
          {settingsData && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
              <p className="font-medium">Settings retrieved successfully!</p>
              <pre className="mt-2 bg-green-100 p-2 rounded overflow-x-auto">
                <code>
                  {JSON.stringify(settingsData, null, 2)}
                </code>
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">Chart placeholder</p>
        </div>
      </div>
    </Layout>
  )
}