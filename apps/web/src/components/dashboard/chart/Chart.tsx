import HighchartsReact from "highcharts-react-official"
import Highstock from "highcharts/highstock"
import { useDashboardData } from "../../../lib/dashboard/context"
import { useChartOptions } from "../../../lib/dashboard/chart/use-chart-options"
import { useEffect } from "react"

const Chart = () => {
  const data = useDashboardData()
  const options = useChartOptions(data)
  
  useEffect(() => {
    // Disable legend clicking with CSS
    const style = document.createElement('style')
    style.textContent = '.highcharts-legend-item { pointer-events: none !important; cursor: default !important; }'
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  return (
    <HighchartsReact 
      highcharts={Highstock} 
      options={options} 
      immutable={true} 
      constructorType="stockChart" 
    />
  )
}

export default Chart