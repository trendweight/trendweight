import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { useTestData, useMeasurementData } from '../lib/api/queries'
import { useRequireAuth } from '../lib/auth/useRequireAuth'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  useRequireAuth()
  
  const { data: testData } = useTestData()
  
  // Measurement data query
  const { 
    data: measurementData, 
    isLoading: isMeasurementLoading, 
    isError: isMeasurementError, 
    error: measurementError 
  } = useMeasurementData()

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
        
        {/* Measurement Data Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Measurement Data</h2>
          
          {isMeasurementLoading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded">
              <p className="font-medium">Loading measurement data...</p>
            </div>
          )}
          
          {isMeasurementError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              <p className="font-medium">Error fetching measurement data:</p>
              <p>{measurementError instanceof Error ? measurementError.message : 'Unknown error'}</p>
            </div>
          )}
          
          {measurementData && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
              <p className="font-medium">Measurement data retrieved successfully!</p>
              <div className="mt-2">
                <p><strong>Sources:</strong> {measurementData.length} provider(s)</p>
                {measurementData.map((sourceData) => (
                  <div key={sourceData.source} className="mt-2">
                    <p><strong>{sourceData.source}:</strong></p>
                    <p>Last Update: {new Date(sourceData.lastUpdate).toLocaleString()}</p>
                    <p>Measurements: {sourceData.measurements?.length || 0} records</p>
                  </div>
                ))}
              </div>
              <pre className="mt-2 bg-green-100 p-2 rounded overflow-x-auto max-h-96 text-xs">
                <code>
                  {JSON.stringify(measurementData.map(source => ({
                    source: source.source,
                    lastUpdate: source.lastUpdate,
                    measurementCount: source.measurements?.length || 0,
                    recentMeasurements: source.measurements?.slice(0, 5).map(m => ({
                      timestamp: m.timestamp,
                      date: new Date(m.timestamp * 1000).toISOString(),
                      weight: m.weight,
                      ...(m.fatRatio !== undefined ? { fatRatio: m.fatRatio } : {})
                    }))
                  })), null, 2)}
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