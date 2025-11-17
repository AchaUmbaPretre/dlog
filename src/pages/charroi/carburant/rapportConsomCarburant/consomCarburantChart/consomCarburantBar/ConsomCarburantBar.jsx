import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Card, Empty } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ConsomCarburantBar = ({ consomMonth = [] }) => {
  // 🎨 Palette dynamique PRO
  const COLORS = [
    "#1a73e8",
    "#ff6b6b",
    "#ffa726",
    "#43a047",
    "#9c27b0",
    "#26c6da",
    "#8d6e63",
    "#ab47bc",
    "#42a5f5",
    "#ef5350",
  ];

  // ⚙️ Préparation PRO des données avec useMemo
  const preparedData = useMemo(() => {
    if (!Array.isArray(consomMonth) || consomMonth.length === 0) return null;

    const labels = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Obtenir tous les types de carburants dynamiquement
    const fuelTypes = [...new Set(consomMonth.map((item) => item.nom_type_carburant))];

    // Construction des datasets automatiquement
    const datasets = fuelTypes.map((fuel, index) => {
      const data = Array(12).fill(0);

      consomMonth.forEach((item) => {
        if (item.nom_type_carburant === fuel) {
          const monthIndex = item.mois - 1;
          data[monthIndex] += item.total_conso || 0;
        }
      });

      return {
        label: fuel,
        data,
        backgroundColor: COLORS[index % COLORS.length],
        borderColor: COLORS[index % COLORS.length],
        borderWidth: 1.5,
        borderRadius: 5, // barres arrondies
      };
    });

    return { labels, datasets };
  }, [consomMonth]);

  // ⚙️ Options PRO
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 13, family: "Nunito" } },
      },
      title: {
        display: true,
        text: "Consommation Mensuelle par Carburant",
        font: { size: 18, family: "Nunito" },
        padding: 15,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw} L`;
          },
        },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutBounce",
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "#e0e0e0" },
        ticks: { stepSize: 50 },
      },
    },
  };

  return (
    <Card style={{ width: "100%" }}>
      {preparedData ? (
        <div style={{ height: 380 }}>
          <Bar data={preparedData} options={options} />
        </div>
      ) : (
        <Empty description="Aucune donnée disponible" />
      )}
    </Card>
  );
};

export default ConsomCarburantBar;
