import { recentDate } from "../../lib/core/dates"
import { Modes } from "../../lib/core/interfaces"
import { formatMeasurement } from "../../lib/core/numbers"
import { useDashboardData } from "../../lib/dashboard/context"

const RecentReadings = () => {
  const {
    dataPoints,
    mode: [mode],
    profile: { useMetric },
  } = useDashboardData()

  const readings = dataPoints.slice(-14).reverse()
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent {Modes[mode]} Readings</h2>
      <table className="w-full md:w-auto md:min-w-[280px] text-sm">
        <thead>
          <tr>
            <th className="text-left pl-0 pb-2 font-medium">Date</th>
            <th className="text-right pb-2 font-medium">Actual</th>
            <th className="text-right pr-0 pb-2 font-medium">Trend</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((m) => (
            <tr key={m.date.toEpochDay()}>
              <td className="pl-0 py-1" suppressHydrationWarning>
                {recentDate(m.date)}
              </td>
              <td className="text-gray-400 text-right py-1">
                {formatMeasurement(m.actual, { type: mode, metric: useMetric, units: false })}
              </td>
              <td className="text-right pr-0 font-semibold py-1">
                {formatMeasurement(m.trend, { type: mode, metric: useMetric, units: false })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentReadings