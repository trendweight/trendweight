import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { queryClient } from '../lib/queryClient'
import { queryKeys } from '../lib/api/queries'
import { apiRequest } from '../lib/api/client'
import type { ProfileData, SettingsData } from '../lib/api/types'

// This loader will prefetch data before the route renders
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    // Prefetch both profile and settings data in parallel
    const promises = [
      queryClient.ensureQueryData({
        queryKey: queryKeys.profile,
        queryFn: () => apiRequest<ProfileData>('/profile'),
      }),
      queryClient.ensureQueryData({
        queryKey: queryKeys.settings,
        queryFn: () => apiRequest<SettingsData>('/settings'),
      }),
    ]
    
    await Promise.all(promises)
  },
  component: DashboardPage,
})

function DashboardPage() {
  // These will use the prefetched data and suspend if needed
  // const { data: profile } = useProfile()
  // const { data: settings } = useSettings()
  
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg text-gray-700">
        Dashboard placeholder - will show weight tracking data here
      </p>
    </Layout>
  )
}