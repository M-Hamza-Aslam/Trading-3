import React, { useContext, useEffect } from "react";
import { initializeChart } from "./ChartModule";
import { RangeContext } from "../../../../context/RangeContext";

const AdvanceChart = ({ coinId }) => {
  const chartRef = React.useRef(null);
  const { ranges, addRange, updateRangePoints, updateRangeId, removeRange } =
    useContext(RangeContext);

  useEffect(() => {
    const range = ranges.filter((range) => range.symbol === coinId)[0];
    initializeChart(
      chartRef.current,
      coinId,
      range,
      addRange,
      updateRangePoints,
      updateRangeId,
      removeRange
    );
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
