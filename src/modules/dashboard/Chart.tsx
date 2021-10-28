import HighchartsReact from "highcharts-react-official";
import Highstock from "highcharts/highstock";
import { logRender } from "../shared/logging";
import { useDashboardData } from "./context";
import { useChartOptions } from "./use-chart-options";

const Chart = () => {
  logRender("Chart");
  const data = useDashboardData();
  const options = useChartOptions(data);
  return <HighchartsReact highcharts={Highstock} options={options} immutable={true} constructorType="stockChart" />;
};

export default Chart;
