import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { Container } from './Container'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Container as="main" className="flex-grow py-4 md:py-6">
        {children}
      </Container>
      <Footer />
    </div>
  )
}