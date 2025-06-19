import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'

export const Route = createFileRoute('/faq')({
  component: FAQPage,
})

function FAQPage() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-4">
        Frequently Asked Questions
      </h1>
      <p className="text-lg text-gray-700">
        FAQ page placeholder - will be replaced with actual content
      </p>
    </Layout>
  )
}