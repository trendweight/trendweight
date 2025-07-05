import { createFileRoute } from '@tanstack/react-router'
import { Container } from '../components/Container'
import { Layout } from '../components/Layout'
import { pageTitle } from '../lib/utils/pageTitle'

export const Route = createFileRoute('/build')({
  component: BuildDetails,
})

function BuildDetails() {
  // TODO: When we have a build system, inject these at build time
  // See scripts/inject-build-info.js for a possible approach
  const environment = import.meta.env.MODE || 'development'

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
                  <td className="px-4 py-2">{new Date().toUTCString()}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Note</td>
                  <td className="px-4 py-2">Build info will be available when deployment system is configured</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </Layout>
    </>
  )
}