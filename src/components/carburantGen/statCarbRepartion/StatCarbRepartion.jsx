import React from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

import {
  ArrowUpOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

import "./statCarbRepartion.scss";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const StatCarbRepartion = () => {
  const carburants = [
    {
      name: "Diesel",
      volume: "5 018 L",
      percent: 58,
      trend: "+8.4%",
      color: "#3A5FCD",
    },
    {
      name: "Essence",
      volume: "2 163 L",
      percent: 25,
      trend: "+2.1%",
      color: "#2BA4C6",
    },
    {
      name: "Super",
      volume: "1 038 L",
      percent: 12,
      trend: "-1.2%",
      color: "#FF8C42",
    },
    {
      name: "Gaz",
      volume: "433 L",
      percent: 5,
      trend: "+0.8%",
      color: "#8B5CF6",
    },
  ];

  const data = {
    labels: carburants.map(
      (item) => item.name
    ),

    datasets: [
      {
        data: carburants.map(
          (item) => item.percent
        ),

        backgroundColor:
          carburants.map(
            (item) => item.color
          ),

        borderWidth: 0,

        spacing: 4,

        borderRadius: 12,

        hoverOffset: 16,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "84%",

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#111827",

        cornerRadius: 14,

        padding: 14,

        displayColors: false,

        callbacks: {
          label: (context) =>
            `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className="fuelDistribution">

      <div className="distributionHeader">

        <div style={{display: 'flex', alignItems:'center', justifyContent:'space-between'}}>

          <span className="distributionLabel">
            Répartition par type de carburant
          </span>

          <div className="headerStats">
            <div className="headerGrowth">

              <ArrowUpOutlined />

              12.4%

            </div>

          </div>
        </div>

      </div>

      <div className="distributionBody">

        <div className="distributionChart">

          <div className="chartGlow" />

          <Doughnut
            data={data}
            options={options}
          />

          <div className="centerKPI">

            <DashboardOutlined />

            <h2>8 652</h2>

            <span>Litres</span>

            <small>
              Total consommé
            </small>

          </div>

        </div>

        <div className="distributionLegend">

          {carburants.map(
            (item, index) => (
              <div
                key={index}
                className="legendItem"
              >
                <div className="legendTop">

                  <div className="legendLeft">

                    <span
                      className="legendDot"
                      style={{
                        background:
                          item.color,
                      }}
                    />

                    <div>

                      <h4>
                        {item.name}
                      </h4>

                      <span>
                        {item.volume}
                      </span>

                    </div>

                  </div>

                  <div className="legendRight">

                    <div className="legendPercent">
                      {item.percent}%
                    </div>

                    <div
                      className={`trend ${
                        item.trend.includes(
                          "+"
                        )
                          ? "positive"
                          : "negative"
                      }`}
                    >
                      {item.trend}
                    </div>

                  </div>

                </div>

                <div className="legendProgress">

                  <div
                    className="legendProgressFill"
                    style={{
                      width: `${item.percent}%`,
                      background:
                        item.color,
                    }}
                  />

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default StatCarbRepartion;