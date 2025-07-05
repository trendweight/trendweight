import { createFileRoute } from '@tanstack/react-router'
import { Banner } from '../components/home/Banner'
import { MainContent } from '../components/home/MainContent'
import { Footer } from '../components/Footer'
import { useDocumentTitle } from '../lib/hooks/useDocumentTitle'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  useDocumentTitle('TrendWeight')

  return (
    <div className="min-h-screen flex flex-col">
      <Banner />
      <MainContent />
      <Footer />
    </div>
  )
}