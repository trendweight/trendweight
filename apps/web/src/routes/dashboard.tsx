import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import Dashboard from '../components/dashboard/Dashboard'
import { useRequireAuth } from '../lib/auth/useRequireAuth'
import { useDocumentTitle } from '../lib/hooks/useDocumentTitle'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  useRequireAuth()
  useDocumentTitle('Dashboard')

  return (
    <Layout>
      <Dashboard />
    </Layout>
  )
}