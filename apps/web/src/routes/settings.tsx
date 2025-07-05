import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { useSettings } from '../lib/api/queries'
import { useRequireAuth } from '../lib/auth/useRequireAuth'
import { pageTitle } from '../lib/utils/pageTitle'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  useRequireAuth()
  
  const { data: settingsData, isError, error } = useSettings()

  return (
    <>
      <title>{pageTitle('Settings')}</title>
      <Layout>
        <div>
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        
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
      </div>
    </Layout>
    </>
  )
}