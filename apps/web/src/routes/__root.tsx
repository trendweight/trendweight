import { createRootRoute, Outlet } from '@tanstack/react-router'
import { RouteProgress } from '../lib/progress/RouteProgress'
import { ProgressTest } from '../components/ProgressTest'

export const Route = createRootRoute({
  component: () => (
    <>
      <RouteProgress />
      <ProgressTest />
      <Outlet />
    </>
  ),
})