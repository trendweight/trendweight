import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import Dashboard from '../components/dashboard/Dashboard'
import { useRequireAuth } from '../lib/auth/useRequireAuth'
import { pageTitle } from '../lib/utils/pageTitle'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  useRequireAuth()

  return (
    <>
      <title>{pageTitle('Dashboard')}</title>
      <Layout>
        <Dashboard />
      </Layout>
    </>
  )
}