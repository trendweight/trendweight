import { formatMeasurement } from "../../lib/core/numbers"
import { useDashboardData } from "../../lib/dashboard/context"

const Deltas = () => {
  const {
    deltas,
    mode: [mode],
    profile: { useMetric },
  } = useDashboardData()

  if (deltas.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Changes</h3>
      <div className="space-y-2">
        {deltas.map((delta) => (
          <div key={delta.period} className="flex justify-between">
            <span className="text-gray-600">{delta.description}</span>
            <span className="font-semibold">
              {formatMeasurement(delta.delta, { type: mode, metric: useMetric, sign: true })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Deltas