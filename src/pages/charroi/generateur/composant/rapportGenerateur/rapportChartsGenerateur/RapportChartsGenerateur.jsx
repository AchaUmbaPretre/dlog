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
import { Divider } from "antd";
import { doughnut3DPlugin } from "../../../../../../utils/doughnut3DPlugin";
import { formatWeekLabel } from "../../../../../../utils/formatWeekLabel";

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


const RapportChartsGenerateur = ({ charts }) => {
  const parGenerateurs = charts?.parGenerateur || [];
  const coutHebdo = charts?.coutHebdo || [];
  const repartition = charts?.repartition || [];
  const [showUSD, setShowUSD] = useState(false);
  const [showUSDCout, setShowUSDCout] = useState(false);

// --- Préparer les datasets (NUMERIQUES et yAxisID) ---
const vehiculeLabels = parGenerateurs.map(
  (v) => `${v.nom_marque} - ${v.nom_modele || "N/A"}`
);

const litersData = parGenerateurs.map((v) => Number(v.total_litres ?? 0));
const cdfData = parGenerateurs.map((v) => Number(v.total_cdf ?? 0));
const usdData = parGenerateurs.map((v) => Number(v.total_usd ?? 0));

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
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 16,
        font: { size: 13, family: "Poppins" }
      }
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          let val = ctx.raw;
          if (val >= 1000) val = val.toLocaleString();
          return `${ctx.dataset.label}: ${val}`;
        },
      },
    },
  },

  scales: {
    y: {
      type: "linear",
      position: "left",
      beginAtZero: true,
      title: { display: true, text: "Coût", font: { size: 13 } },
      ticks: {
        callback: (v) => (v >= 1000 ? v.toLocaleString() : v),
      },
    },

    yConsom: {
      type: "linear",
      position: "right",
      beginAtZero: true,
      grid: { drawOnChartArea: false },
      title: { display: true, text: "Consommation (L)", font: { size: 13 } },
    },
  },
};


  //Évolution du coût par semaine
 const coutLabels = coutHebdo.map((c) => formatWeekLabel(c.semaine));
  const coutDataCDF = {
  labels: coutLabels,
  datasets: [
    {
      label: "Coût (CDF)",
      data: coutHebdo.map((c) => c.total_cdf),
      borderColor: "#1774ff",
      backgroundColor: "rgba(23, 116, 255, 0.25)",
      borderWidth: 3,
      tension: 0.35,
      fill: true,
      pointRadius: 4,
    },
    {
      label: "Consommation (L)",
      data: coutHebdo.map((c) => c.total_consom),
      borderColor: "#00c897",
      backgroundColor: "rgba(0, 200, 151, 0.20)",
      borderWidth: 3,
      tension: 0.35,
      fill: true,
      pointRadius: 4,
      yAxisID: "yConsom",
    },
  ],
  };

  const coutDataUSD = {
    labels: coutLabels,
    datasets: [
      {
        label: "Coût (USD)",
        data: coutHebdo.map((c) => c.total_usd),
        borderColor: "#f5a623",
        backgroundColor: "rgba(245, 166, 35, 0.25)",
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointRadius: 4,
      },
      {
        label: "Consommation (L)",
        data: coutHebdo.map((c) => c.total_consom),
        borderColor: "#00c897",
        backgroundColor: "rgba(0, 200, 151, 0.20)",
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        yAxisID: "yConsom",
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
            <span><InfoCircleOutlined /> Consommation par générateur</span>
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
          <Divider />
          {parGenerateurs.length > 0 ? (
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
              <div className="chart__title" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span className="chart__title"><LineChartOutlined /> Évolution du coût par semaine</span>
                
                <button
                  onClick={() => setShowUSDCout(!showUSDCout)}
                  style={{
                    border: "none",
                    background: "#1677ff",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {showUSDCout ? "Afficher CDF" : "Afficher USD"}
                </button>
              </div>   
              <Divider />           
              {coutHebdo.length > 0 ? (
                  <Line 
                    key={showUSDCout ? "cout-usd" : "cout-cdf"} 
                    data={showUSDCout ? coutDataUSD : coutDataCDF} 
                  />
                ) : (
                  <p className="chart__empty">Aucune donnée disponible</p>
                )}
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

export default RapportChartsGenerateur;