// This module handles Suspense integration for authentication

type AuthResolver = () => void
type AuthSubscriber = (isInitializing: boolean) => void

class AuthSuspenseManager {
  private isInitializing = true
  private promise: Promise<void> | null = null
  private resolvers: AuthResolver[] = []
  private subscribers: AuthSubscriber[] = []

  setInitializing(value: boolean) {
    this.isInitializing = value
    
    if (!value && this.resolvers.length > 0) {
      // Auth has finished initializing, resolve all pending promises
      this.resolvers.forEach(resolve => resolve())
      this.resolvers = []
      this.promise = null
    }

    // Notify all subscribers
    this.subscribers.forEach(subscriber => subscriber(value))
  }

  subscribe(callback: AuthSubscriber) {
    this.subscribers.push(callback)
    // Immediately call with current state
    callback(this.isInitializing)
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    }
  }

  getPromise(): Promise<void> {
    if (!this.isInitializing) {
      return Promise.resolve()
    }

    if (!this.promise) {
      this.promise = new Promise<void>((resolve) => {
        this.resolvers.push(resolve)
      })
    }

    return this.promise
  }

  get isAuthInitializing() {
    return this.isInitializing
  }
}

export const authSuspenseManager = new AuthSuspenseManager()