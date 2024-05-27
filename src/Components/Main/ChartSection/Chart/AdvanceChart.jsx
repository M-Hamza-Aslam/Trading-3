import React, { useEffect } from "react";
import { initializeChart } from "./ChartModule";

const AdvanceChart = ({ coinId }) => {
  const chartRef = React.useRef(null);
  useEffect(() => {
    initializeChart(chartRef.current, coinId);
  }, [coinId]);

  return (
    <div
      id="chart-container"
      style={{
        height: "500px",
        position: "relative",
        overflow: "hidden",
      }}
      ref={chartRef}
    ></div>
  );
};

export default AdvanceChart;
