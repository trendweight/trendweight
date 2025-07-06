import { FaTwitter, FaFacebook, FaGithub, FaRss } from 'react-icons/fa'
import { Container } from './Container'

export function Footer() {
  const buildVersion = import.meta.env.VITE_BUILD_VERSION || ''
  const buildCommit = import.meta.env.VITE_BUILD_COMMIT || ''
  const buildRepo = import.meta.env.VITE_BUILD_REPO || ''
  
  const isTag = buildVersion.startsWith('v')
  const hasCommit = buildCommit && buildCommit !== 'Not available'
  
  let versionDisplay = 'dev'
  let versionUrl = null
  
  if (isTag && buildRepo) {
    // Tagged release - show version and link to release
    versionDisplay = buildVersion
    versionUrl = `https://github.com/${buildRepo}/releases/tag/${buildVersion}`
  } else if (hasCommit && buildRepo) {
    // Non-tag build with commit - show short SHA and link to commit
    versionDisplay = buildCommit.substring(0, 7)
    versionUrl = `https://github.com/${buildRepo}/commit/${buildCommit}`
  } else if (hasCommit) {
    // Local build with commit but no repo - just show SHA
    versionDisplay = buildCommit.substring(0, 7)
  }
  // Otherwise falls back to 'dev'

  return (
    <footer className="py-4">
      <Container>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-gray-400">
          <div className="text-sm flex items-center gap-2">
            {versionUrl ? (
              <a href={versionUrl} target="_blank" rel="noopener noreferrer" 
                 className="hover:text-gray-600 transition-colors font-mono">
                {versionDisplay}
              </a>
            ) : (
              <span className="font-mono">{versionDisplay}</span>
            )}
            <span>·</span>
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