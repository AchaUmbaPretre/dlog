import React, { useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { InfoCircleOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined } from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./rapportChart.scss";

//DOUGHNUT 3D PLUGIN
const doughnut3DPlugin = {
  id: "doughnut3DPlugin",
  beforeDraw(chart) {
    const { ctx, chartArea, data } = chart;
    const meta = chart.getDatasetMeta(0);

    if (!meta || !meta.data) return;

    const slices = meta.data;
    const x = (chartArea.left + chartArea.right) / 2;
    const y = (chartArea.top + chartArea.bottom) / 2 + 12;
    const extraDepth = 18;

    slices.forEach((slice, i) => {
      const angle = slice.startAngle;
      const angle2 = slice.endAngle;

      ctx.save();
      ctx.beginPath();

      // Sécurisation ici ↓↓↓
      const color = data.datasets[0].backgroundColor[i] || "rgba(0,0,0,0.5)";
      const depthColor = color.replace(/0\.\d+/, "0.50");

      ctx.fillStyle = depthColor;

      for (let depth = 0; depth < extraDepth; depth++) {
        ctx.moveTo(x, y + depth);
        ctx.arc(x, y + depth, slice.outerRadius, angle, angle2);
      }

      ctx.fill();
      ctx.restore();
    });
  },
};



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  doughnut3DPlugin 
);


const RapportCharts = ({ charts }) => {
  const parVehicule = charts?.parVehicule || [];
  const coutHebdo = charts?.coutHebdo || [];
  const repartition = charts?.repartition || [];
  const [showUSD, setShowUSD] = useState(false);

// --- Préparer les datasets (NUMERIQUES et yAxisID) ---
const vehiculeLabels = parVehicule.map(
  (v) => `${v.nom_marque} - ${v.immatriculation || "N/A"}`
);

const litersData = parVehicule.map((v) => Number(v.total_litres ?? 0));
const cdfData = parVehicule.map((v) => Number(v.total_cdf ?? 0));
const usdData = parVehicule.map((v) => Number(v.total_usd ?? 0));

const vehiculeDataCDF = {
  labels: vehiculeLabels,
  datasets: [
    {
      label: "Litres consommés",
      data: litersData,
      backgroundColor: "rgba(54, 162, 235, 0.8)",
      yAxisID: "yLitres",        // <-- litres -> axe gauche
      order: 1,
    },
    {
      label: "Coût (CDF)",
      data: cdfData,
      backgroundColor: "rgba(255, 99, 132, 0.8)",
      yAxisID: "yMoney",         // <-- coût -> axe droit
      order: 2,
    },
  ],
};

const vehiculeDataUSD = {
  labels: vehiculeLabels,
  datasets: [
    {
      label: "Litres consommés",
      data: litersData,
      backgroundColor: "rgba(54, 162, 235, 0.8)",
      yAxisID: "yLitres",
      order: 1,
    },
    {
      label: "Coût (USD)",
      data: usdData,
      backgroundColor: "rgba(255, 205, 86, 0.8)",
      yAxisID: "yMoney",
      order: 2,
    },
  ],
};

// --- Options avec 2 axes Y ---
const vehiculeOptions = {
  responsive: true,
  interaction: { mode: "index", intersect: false },
  stacked: false,
  plugins: {
    legend: { position: "top" },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const label = ctx.dataset.label || "";
          const value = ctx.raw;
          if (/Litres/i.test(label)) return `${label}: ${value} L`;
          return `${label}: ${value}`;
        },
      },
    },
  },
  scales: {
    yLitres: {
      type: "linear",
      position: "left",
      title: { display: true, text: "Litres" },
      ticks: {
        beginAtZero: true,
      },
      grid: { drawOnChartArea: true },
    },
    yMoney: {
      type: "linear",
      position: "right",
      title: { display: true, text: "Coût" },
      ticks: {
        beginAtZero: true,
        callback: function (value) {
          return value >= 1000 ? value.toLocaleString() : value;
        },
      },
      grid: { drawOnChartArea: false },
    },
  },
};



  //Évolution du coût par semaine
  const coutLabels = coutHebdo.map((c) => `Semaine ${c.semaine}`);
  const coutData = {
    labels: coutLabels,
    datasets: [
      {
        label: "Coût total (CDF)",
        data: coutHebdo.map((c) => c.total_cdf),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        tension: 0.3,
        fill: true,
        pointRadius: 5,
      },
      {
        label: "Coût total (USD)",
        data: coutHebdo.map((c) => c.total_usd),
        borderColor: "rgba(255, 205, 86, 1)",
        backgroundColor: "rgba(255, 205, 86, 0.3)",
        tension: 0.3,
        fill: true,
        pointRadius: 5,
      },
    ],
  };

  //Répartition du carburant
  const generateProColors = (count) => {
    const arr = [];
    const step = 360 / count;

    for (let i = 0; i < count; i++) {
      arr.push(`hsla(${i * step}, 70%, 55%, 0.85)`);
    }
    return arr;
  };

  const repartitionData = {
    labels: repartition.map((r) => r.abreviation ?? "N/A"),
    datasets: [
      {
        label: "Total litres",
        data: repartition.map((r) => Number(r.total_litres) || 0),
        backgroundColor: generateProColors(repartition.length),
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 18,
      },
    ],
  };

  const repartitionOptions = {
      cutout: "55%",
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 15,
            font: { size: 13, family: "Poppins" },
            color: "#444",
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw} litres`,
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        easing: "easeOutQuart",
        duration: 1200,
      },
  };

  return (
    <section className="card charts">
      <h2 className="card__title">
        <BarChartOutlined /> Graphiques
      </h2>

      <div className="charts__flex">

        <div className="chart chart--primary chart--small">
          <div className="chart__title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span><InfoCircleOutlined /> Consommation par véhicule</span>
            <button 
              onClick={() => setShowUSD(!showUSD)}
              style={{
                border: "none",
                background: "#1677ff",
                color: "white",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              {showUSD ? "Afficher CDF" : "Afficher USD"}
            </button>
          </div>
          {parVehicule.length > 0 ? (
              <Bar
                key={showUSD ? "usd" : "cdf"}
                data={showUSD ? vehiculeDataUSD : vehiculeDataCDF}
                options={vehiculeOptions}
              />
            ) : (
              <p className="chart__empty">Aucune donnée disponible</p>
            )}

        </div>

        <div className="charts__right">
            <div className="chart chart--secondary">
            <h3 className="chart__title"><LineChartOutlined /> Évolution du coût par semaine</h3>
            {coutHebdo.length > 0 ? <Line data={coutData} /> : <p className="chart__empty">Aucune donnée disponible</p>}
            </div>

            <div className="chart chart--tertiary">
              <h3 className="chart__title"><PieChartOutlined /> Répartition du carburant</h3>
              {repartition.length > 0 ? (
                <Doughnut data={repartitionData} options={repartitionOptions} />
              ) : (
                <p className="chart__empty">Aucune donnée disponible</p>
              )}

            </div>
        </div>
      </div>

    </section>
  );
};

export default RapportCharts;