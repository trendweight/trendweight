import { createRootRoute, Outlet } from '@tanstack/react-router'
import { RouteProgress } from '../lib/progress/RouteProgress'

export const Route = createRootRoute({
  component: () => (
    <>
      <RouteProgress />
      <Outlet />
    </>
  ),
})