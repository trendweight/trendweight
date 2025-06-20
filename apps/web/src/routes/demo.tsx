import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})

function DemoPage() {
  return (
    <Layout>
      <div>
        <h1 className="text-4xl font-bold mb-4">Demo</h1>
        <p className="text-gray-600">Demo coming soon...</p>
      </div>
    </Layout>
  )
}