import { useProgress } from '@bprogress/react'

export function ProgressTest() {
  const { start, stop } = useProgress()
  
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      <button onClick={() => start(0)} style={{ marginRight: 10 }}>Start Progress</button>
      <button onClick={() => stop()}>Stop Progress</button>
    </div>
  )
}