import { FaTwitter, FaFacebook, FaGithub, FaRss } from 'react-icons/fa'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="py-4">
      <Container>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-gray-400">
          <div className="text-sm">
            © 2012-{new Date().getFullYear()} Erv Walter
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm">
            <div className="flex items-center gap-2 md:gap-4">
              <a href="https://twitter.com/trendweight" className="hover:text-gray-600 transition-colors">
                <FaTwitter />
              </a>
              <a href="https://facebook.com/trendweight" className="hover:text-gray-600 transition-colors">
                <FaFacebook />
              </a>
              <a href="https://github.com/trendweight" className="hover:text-gray-600 transition-colors">
                <FaGithub />
              </a>
              <a href="https://blog.trendweight.com" className="hover:text-gray-600 transition-colors">
                <FaRss />
              </a>
            </div>
            <a href="mailto:erv@ewal.net" className="hover:text-gray-600 transition-colors">
              Contact
            </a>
            <a href="/tipjar" className="hover:text-gray-600 transition-colors">
              Tip Jar
            </a>
            <a href="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}