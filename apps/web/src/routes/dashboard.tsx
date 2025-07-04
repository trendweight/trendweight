import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import Dashboard from '../components/dashboard/Dashboard'
import { useRequireAuth } from '../lib/auth/useRequireAuth'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  useRequireAuth()

  return (
    <Layout>
      <Dashboard />
    </Layout>
  )
}