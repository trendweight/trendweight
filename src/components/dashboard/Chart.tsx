import HighchartsReact from "highcharts-react-official";
import Highstock from "highcharts/highstock";
import { useDashboardData } from "~/lib/dashboard/context";
import { useChartOptions } from "~/lib/dashboard/use-chart-options";
import { logRender } from "~/lib/utils/logging";

const Chart = () => {
  logRender("Chart");
  const data = useDashboardData();
  const options = useChartOptions(data);
  return <HighchartsReact highcharts={Highstock} options={options} constructorType="stockChart" />;
};

export default Chart;
