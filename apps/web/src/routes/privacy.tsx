import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-4">
        Privacy Policy
      </h1>
      <p className="text-lg text-gray-700">
        Privacy page placeholder - will be replaced with actual content
      </p>
    </Layout>
  )
}