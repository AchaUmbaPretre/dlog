import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, Empty } from "antd";

ChartJS.register(ArcElement, Tooltip, Legend);

const ConsomCarburantLine = ({ consomYear = [] }) => {

  // 🎨 Palette PRO automatique
  const COLORS = [
    "#1a73e8",
    "#ff6b6b",
    "#ffa726",
    "#43a047",
    "#9c27b0",
    "#26c6da",
    "#ef5350",
    "#8d6e63",
    "#42a5f5",
    "#ab47bc",
  ];

  // ⚙️ Optimisation avec useMemo
  const preparedData = useMemo(() => {
    if (!Array.isArray(consomYear) || consomYear.length === 0) return null;

    // Labels uniques (Essence, Diesel, etc.)
    const labels = [...new Set(consomYear.map((item) => item.nom_type_carburant))];

    // Somme des valeurs par type de carburant
    const values = labels.map((label) =>
      consomYear
        .filter((item) => item.nom_type_carburant === label)
        .reduce((sum, item) => sum + (item.total_conso || 0), 0)
    );

    return {
      labels,
      datasets: [
        {
          label: "Consommation annuelle",
          data: values,
          backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
  }, [consomYear]);

  // Options PRO
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 13, family: "Nunito" } },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((value / total) * 100).toFixed(2);
            return `${context.label}: ${value} L (${pct}%)`;
          },
        },
      },
      title: {
        display: true,
        text: "Répartition annuelle de la consommation",
        font: { size: 18, family: "Nunito" },
        padding: 15,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  return (
    <Card style={{ width: "100%", height: 360 }}>
      {preparedData ? (
        <div style={{ height: "300px" }}>
          <Doughnut data={preparedData} options={options} />
        </div>
      ) : (
        <Empty description="Aucune donnée disponible" />
      )}
    </Card>
  );
};

export default ConsomCarburantLine;
