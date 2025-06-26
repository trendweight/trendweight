import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { useTestData, useSettings, useWithingsTest } from '../lib/api/queries'
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
  
  // Withings test query
  const { 
    data: withingsData, 
    isLoading: isWithingsLoading, 
    isError: isWithingsError, 
    error: withingsError 
  } = useWithingsTest({
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
        
        {/* Withings API Test Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Withings API Test</h2>
          
          {isWithingsLoading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded">
              <p className="font-medium">Loading Withings data...</p>
            </div>
          )}
          
          {isWithingsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              <p className="font-medium">Error fetching Withings data:</p>
              <p>{withingsError instanceof Error ? withingsError.message : 'Unknown error'}</p>
            </div>
          )}
          
          {withingsData && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
              <p className="font-medium">Withings API test successful!</p>
              <div className="mt-2">
                <p><strong>Token Info:</strong> User ID: {withingsData.tokenInfo.userId.substring(0, 10)}...</p>
                <p><strong>Measurements:</strong> {withingsData.measurements.length} records</p>
                <p><strong>Timezone:</strong> {withingsData.timezone}</p>
              </div>
              <pre className="mt-2 bg-green-100 p-2 rounded overflow-x-auto max-h-48 text-xs">
                <code>
                  {JSON.stringify({
                    tokenInfo: {
                      userId: withingsData.tokenInfo.userId.substring(0, 10) + '...',
                      expiresAt: withingsData.tokenInfo.expiresAt,
                      isRefreshed: withingsData.tokenInfo.isRefreshed
                    },
                    measurements: withingsData.measurements.slice(0, 3).map(m => ({
                      date: m.date,
                      weight: m.weight,
                      // Include other properties if available
                      ...(m.fatMass ? { fatMass: m.fatMass } : {}),
                      ...(m.fatFreeMass ? { fatFreeMass: m.fatFreeMass } : {}),
                      ...(m.fatRatio ? { fatRatio: m.fatRatio } : {})
                    })),
                    pagination: withingsData.pagination,
                    timezone: withingsData.timezone
                  }, null, 2)}
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