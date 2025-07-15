import { recentDate } from "../../lib/core/dates";
import { Modes } from "../../lib/core/interfaces";
import { formatMeasurement } from "../../lib/core/numbers";
import { useDashboardData } from "../../lib/dashboard/hooks";
import { Heading } from "../ui/Heading";

const RecentReadings = () => {
  const {
    dataPoints,
    mode: [mode],
    profile: { useMetric },
  } = useDashboardData();

  const readings = dataPoints.slice(-14).reverse();

  return (
    <div>
      <Heading level={3}>Recent {Modes[mode]} Readings</Heading>
      <table className="w-full text-sm md:w-auto md:min-w-[280px]">
        <thead>
          <tr>
            <th className="pb-2 pl-0 text-left font-medium">Date</th>
            <th className="pb-2 text-right font-medium">Actual</th>
            <th className="pr-0 pb-2 text-right font-medium">Trend</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((m) => (
            <tr key={m.date.toEpochDay()}>
              <td className="py-1 pl-0" suppressHydrationWarning>
                {recentDate(m.date)}
              </td>
              <td className="py-1 text-right text-gray-400">{formatMeasurement(m.actual, { type: mode, metric: useMetric, units: false })}</td>
              <td className="py-1 pr-0 text-right font-semibold">{formatMeasurement(m.trend, { type: mode, metric: useMetric, units: false })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentReadings;
