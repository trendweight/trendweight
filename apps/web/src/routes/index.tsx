import { createFileRoute } from '@tanstack/react-router'
import { Banner } from '../components/home/Banner'
import { MainContent } from '../components/home/MainContent'
import { Footer } from '../components/Footer'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Banner />
      <MainContent />
      <Footer />
    </div>
  )
}