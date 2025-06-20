import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <Layout>
      <div>
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <p className="text-gray-600">Settings coming soon...</p>
      </div>
    </Layout>
  )
}