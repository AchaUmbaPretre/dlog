import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

import {
  ArrowUpOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import {
  Segmented,
  DatePicker,
  Button,
  Popover,
} from "antd";

import "./statCarbDepense.scss";

const { RangePicker } = DatePicker;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const StatCarbDepense = () => {
  const [period, setPeriod] = useState("30j");
  const [open, setOpen] = useState(false);

  const data = useMemo(
    () => ({
      labels: [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aoû",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ],

      datasets: [
        {
          label: "Dépenses",

          data: [
            12000,
            14500,
            13200,
            17000,
            18500,
            21000,
            24560,
            23500,
            28000,
            31000,
            29500,
            34000,
          ],

          borderColor: "#3A5FCD",

          borderWidth: 3,

          tension: 0.45,

          fill: true,

          pointRadius: 0,

          pointHoverRadius: 7,

          pointHoverBackgroundColor: "#fff",

          pointHoverBorderColor: "#3A5FCD",

          pointHoverBorderWidth: 3,

          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) return null;

            const gradient =
              ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              );

            gradient.addColorStop(
              0,
              "rgba(58,95,205,.25)"
            );

            gradient.addColorStop(
              1,
              "rgba(58,95,205,0)"
            );

            return gradient;
          },
        },

        {
          label: "Période précédente",

          data: [
            10000,
            12500,
            12000,
            15000,
            16500,
            18000,
            21000,
            20500,
            24000,
            26000,
            25000,
            29000,
          ],

          borderColor:
            "rgba(140,140,140,.4)",

          borderDash: [6, 6],

          borderWidth: 2,

          pointRadius: 0,

          tension: 0.45,
        },
      ],
    }),
    []
  );

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#111827",

        cornerRadius: 14,

        padding: 14,

        displayColors: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        border: {
          display: false,
        },
      },

      y: {
        border: {
          display: false,
        },

        grid: {
          color:
            "rgba(148,163,184,.08)",
        },

        ticks: {
          callback: (value) =>
            `${value / 1000}k`,
        },
      },
    },
  };

  return (
    <div className="fuelExpenseChart">

      <div className="chartHeader">

        <div className="chartInfo">

          <span className="chartTitle">
            Evolution des dépenses carburant
          </span>

          <div className="chartKpi">

            <h2>34 000 $</h2>

            <div className="growthBadge">
              <ArrowUpOutlined />
              12.5%
            </div>

          </div>

        </div>

        <div className="chartToolbar">

          <Segmented
            size="small"
            value={period}
            onChange={setPeriod}
            options={[
              {
                label: "7J",
                value: "7j",
              },
              {
                label: "30J",
                value: "30j",
              },
              {
                label: "90J",
                value: "90j",
              },
              {
                label: "1A",
                value: "1y",
              },
            ]}
          />

          <Popover
            trigger="click"
            open={open}
            onOpenChange={setOpen}
            content={
              <RangePicker />
            }
          >
            <Button
              icon={
                <CalendarOutlined />
              }
            />
          </Popover>

          <Button
            icon={<ReloadOutlined />}
          />

        </div>

      </div>

      <div className="chartDivider" />

      <div className="chartContainer">
        <Line
          data={data}
          options={options}
        />
      </div>

    </div>
  );
};

export default StatCarbDepense;