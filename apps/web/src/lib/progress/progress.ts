import { useProgress } from '@bprogress/react'
import { useEffect, useRef } from 'react'

// Delay before showing progress (prevents flash on fast operations)
const PROGRESS_DELAY = 250

/**
 * Hook to manage progress with delay
 * Prevents flash of progress bar on fast operations
 */
export function useDelayedProgress() {
  const progress = useProgress()
  const timerRef = useRef<number | undefined>(undefined)
  const isShowingRef = useRef(false)

  const startDelayed = () => {
    // Clear any existing timer
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    // Start progress after delay
    timerRef.current = window.setTimeout(() => {
      progress.start(0) // Start from position 0
      isShowingRef.current = true
      timerRef.current = undefined
    }, PROGRESS_DELAY)
  }

  const stopDelayed = () => {
    // Clear timer if progress hasn't started yet
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = undefined
    }

    // Stop progress if it's showing
    if (isShowingRef.current) {
      progress.stop()
      isShowingRef.current = false
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  return { startDelayed, stopDelayed }
}

// Store the progress instance
let progressInstance: ReturnType<typeof useProgress> | null = null

// Centralized progress state management - only tracks data fetching
let fetchingCount = 0
let delayTimer: number | undefined
let isShowing = false

const progressManager = {
  setProgress: (progress: ReturnType<typeof useProgress>) => {
    progressInstance = progress
  },

  setFetching: (active: number) => {
    fetchingCount = active
    progressManager.updateProgress()
  },

  updateProgress() {
    if (!progressInstance) return

    const shouldBeActive = fetchingCount > 0

    if (shouldBeActive && !isShowing && !delayTimer) {
      // Clear any existing timer first
      if (delayTimer) {
        window.clearTimeout(delayTimer)
      }
      
      // Start timer for delayed start
      delayTimer = window.setTimeout(() => {
        // Check again in case state changed during delay
        if (fetchingCount > 0 && progressInstance) {
          progressInstance.start(0)
          isShowing = true
        }
        delayTimer = undefined
      }, PROGRESS_DELAY)
    } else if (!shouldBeActive) {
      // Clear any pending timer
      if (delayTimer) {
        window.clearTimeout(delayTimer)
        delayTimer = undefined
      }
      // Stop progress if showing
      if (isShowing) {
        progressInstance.stop()
        isShowing = false
      }
    }
  },

  // Force stop progress (useful for cleanup)
  forceStop() {
    fetchingCount = 0
    if (delayTimer) {
      window.clearTimeout(delayTimer)
      delayTimer = undefined
    }
    if (isShowing && progressInstance) {
      progressInstance.stop()
      isShowing = false
    }
  },

  isActive: () => fetchingCount > 0
}

export default progressManager