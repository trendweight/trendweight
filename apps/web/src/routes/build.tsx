import { createFileRoute } from '@tanstack/react-router'
import { Container } from '../components/Container'
import { Layout } from '../components/Layout'
import { pageTitle } from '../lib/utils/pageTitle'

export const Route = createFileRoute('/build')({
  component: BuildDetails,
})

function BuildDetails() {
  const environment = import.meta.env.MODE || 'development'
  const buildTime = import.meta.env.VITE_BUILD_TIME || 'Not available'
  const buildCommit = import.meta.env.VITE_BUILD_COMMIT || 'Not available'
  const buildBranch = import.meta.env.VITE_BUILD_BRANCH || 'Not available'
  const buildVersion = import.meta.env.VITE_BUILD_VERSION || 'Not available'
  const buildRepo = import.meta.env.VITE_BUILD_REPO || ''

  const githubRepo = buildRepo ? `https://github.com/${buildRepo}` : null
  
  const isTag = buildVersion.startsWith('v') || (!buildVersion.startsWith('build-') && buildVersion !== 'Not available' && buildVersion !== 'local')
  const commitUrl = githubRepo && buildCommit !== 'Not available' ? `${githubRepo}/commit/${buildCommit}` : null
  const versionUrl = githubRepo && buildVersion !== 'Not available' && buildVersion !== 'local' ? 
    (isTag ? `${githubRepo}/releases/tag/${buildVersion}` : `${githubRepo}/actions/runs`) : null

  return (
    <>
      <title>{pageTitle('Build Details')}</title>
      
      <Layout>
        <Container>
          <h1 className="mb-6 text-3xl font-bold">Build Details</h1>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-semibold">Key</th>
                  <th className="px-4 py-2 text-left font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">Environment</td>
                  <td className="px-4 py-2">{environment}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Build Time</td>
                  <td className="px-4 py-2">{buildTime}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Git Commit</td>
                  <td className="px-4 py-2 font-mono text-sm">
                    {commitUrl ? (
                      <a href={commitUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800 underline">
                        {buildCommit.substring(0, 7)}
                      </a>
                    ) : buildCommit}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Git Branch</td>
                  <td className="px-4 py-2">{buildBranch}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Version</td>
                  <td className="px-4 py-2">
                    {versionUrl ? (
                      <a href={versionUrl} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800 underline">
                        {buildVersion}
                      </a>
                    ) : buildVersion}
                  </td>
                </tr>
                {buildRepo && githubRepo && (
                  <tr className="border-b">
                    <td className="px-4 py-2">Repository</td>
                    <td className="px-4 py-2">
                      <a href={githubRepo} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800 underline">
                        {buildRepo}
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Container>
      </Layout>
    </>
  )
}