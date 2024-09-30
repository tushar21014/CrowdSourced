import { Chart } from "chart.js/auto";

import { useState, useRef, useEffect } from "react";

// Line chart component
function LineChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: data,
    });

    console.log("Chart", chartRef.current);
    return () => {
      chartRef.current.destroy();
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
}

// Doughnut chart component
function DoughnutChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: {
        legend: {
          display: false,
        },
      },
    });

    return () => {
      chartRef.current.destroy();
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
}

function PieChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        legend: {
          display: false,
        },
      },
    });

    return () => {
      chartRef.current.destroy();
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
}

function BarChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        legend: {
          display: false,
        },
      },
    });

    return () => {
      chartRef.current.destroy();
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
}

export { LineChart, DoughnutChart, PieChart, BarChart };