import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <Layout>
      <div>
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-4">
          Welcome to your dashboard! Weight tracking features coming soon.
        </p>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">Chart placeholder</p>
        </div>
      </div>
    </Layout>
  )
}