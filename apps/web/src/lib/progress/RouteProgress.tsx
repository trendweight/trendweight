import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import progressManager from './progress'

/**
 * Component that tracks TanStack Router navigation and shows progress bar
 * Matches legacy NProgress route change behavior
 */
export function RouteProgress() {
  const router = useRouter()

  useEffect(() => {
    // Subscribe to router navigation events
    const unsubscribeBeforeLoad = router.subscribe('onBeforeLoad', () => {
      progressManager.setRouteChanging(true)
    })

    const unsubscribeLoad = router.subscribe('onLoad', () => {
      progressManager.setRouteChanging(false)
    })

    return () => {
      unsubscribeBeforeLoad()
      unsubscribeLoad()
      // Clean up any pending route changes
      progressManager.setRouteChanging(false)
    }
  }, [router])

  return null
}

export default RouteProgress