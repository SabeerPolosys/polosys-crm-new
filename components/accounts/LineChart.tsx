"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  ChartData,
  ChartOptions,
  ScriptableContext,
  Color,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip
);

const LineChart = () => {
  const labels: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Dec",
  ];

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "",
        data: [2500, 3000, 2300, 3500, 4200, 6500],
        borderColor: "#ccc",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        backgroundColor: (context: ScriptableContext<"line">): Color => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // If chartArea is not ready, return transparent
          if (!chartArea) return "rgba(0,0,0,0)";

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          return gradient as CanvasGradient; // Cast here
        },
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false, // Key for full width & height
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#888" },
      },
      y: {
        grid: { color: "#eee" },
        ticks: { color: "#888" },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
