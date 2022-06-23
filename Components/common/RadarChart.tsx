import { Radar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { PokemonStat } from "../../types/detail";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
)


interface ChartProps {
  chartData: PokemonStat[]
}

function RadarChart(props: ChartProps) {
  const { chartData } = props;
  const getChartData = () => {

    return {
      labels: chartData.map(data => data.label),
      datasets:[{
        label: 'Stats',
        borderWidth: 3,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#acced8',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)',
        data: chartData.map(data => data.base_stat),
      }]
    };
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: true,

    scale: {
      gridLines: {
        circular: true
      }
    }
  };
  
  return (
    <Radar data={getChartData()} options={options} />
  )

}

export default RadarChart;