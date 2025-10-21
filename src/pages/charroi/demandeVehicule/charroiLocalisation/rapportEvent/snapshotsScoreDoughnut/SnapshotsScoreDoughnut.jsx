// SnapshotsScoreDoughnut.jsx
import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * props:
 *  - snapshots: array d'objets { check_time: "...", status: "connected" | "disconnected" | ... }
 *  - labelsOptional: array de labels pour chaque snapshot (ex: ["00h","06h","12h","18h"])
 */
const SnapshotsScoreDoughnut = ({ snapshots = [], labelsOptional = [] }) => {
  // On attend 4 snapshots; si moins, on considère les manquants comme disconnected (0%)
  const normalized = useMemo(() => {
    // tranches = array length 4 of 0/25
    const tranches = [0, 0, 0, 0];
    for (let i = 0; i < Math.min(4, snapshots.length); i++) {
      tranches[i] = snapshots[i].status === "connected" ? 25 : 0;
    }
    const sum = tranches.reduce((a, b) => a + b, 0);
    const remainder = Math.max(0, 100 - sum); // visual filler
    return { tranches, sum, remainder };
  }, [snapshots]);

  const labels = labelsOptional.length === 4
    ? labelsOptional.concat(["Restant"])
    : ["00-06", "06-12", "12-18", "18-24", "Restant"];

  const data = {
    labels,
    datasets: [
      {
        data: [...normalized.tranches, normalized.remainder],
        backgroundColor: [
          "#52c41a", // tranche 1 (connected = green)
          "#52c41a", // tranche 2
          "#52c41a", // tranche 3
          "#52c41a", // tranche 4
          "#f0f0f0", // remainder (gris)
        ].map((col, idx) => {
          // rendre gris si tranche = 0 (déconnectée)
          if (idx < 4 && normalized.tranches[idx] === 0) return "#e8e8e8";
          return col;
        }),
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || "";
            const val = ctx.parsed || 0;
            return `${label} : ${val}%`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 700,
      easing: "easeOutQuart",
    },
  };

  return (
    <div style={{ position: "relative", width: 180, height: 180 }}>
      <Doughnut data={data} options={options} />
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center", flexDirection: "column",
      }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{normalized.sum}%</div>
        <div style={{ fontSize: 12, color: "#666" }}>Score journalier</div>
      </div>
    </div>
  );
};

export default SnapshotsScoreDoughnut;
