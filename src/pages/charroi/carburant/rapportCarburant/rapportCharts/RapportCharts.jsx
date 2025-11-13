import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const RapportCharts = ({ charts }) => {
  // Protection : si pas encore de données, on met des valeurs vides
  const parVehicule = charts?.parVehicule || [];
  const coutHebdo = charts?.coutHebdo || [];
  const repartition = charts?.repartition || [];

  // === Consommation par véhicule ===
  const vehiculeLabels = parVehicule.map(
    (v) => `${v.nom_marque} - ${v.immatriculation}`
  );

  const vehiculeData = {
    labels: vehiculeLabels,
    datasets: [
      {
        label: "Litres consommés",
        data: parVehicule.map((v) => v.total_litres),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Coût (CDF)",
        data: parVehicule.map((v) => v.total_cdf),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  // === Évolution du coût par semaine ===
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

  // === Répartition du carburant ===
  const repartitionData = {
    labels: repartition.map((r) => r.abreviation),
    datasets: [
      {
        label: "Total litres",
        data: repartition.map((r) => r.total_litres),
        backgroundColor: [
          "rgba(255, 159, 64, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(75, 192, 192, 0.7)",
        ],
      },
    ],
  };

  return (
    <section className="card charts" style={{ marginTop: "20px" }}>
      <h2 className="card__title text-xl font-bold mb-6">Graphiques</h2>

      <div
        className="charts__flex"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "space-between",
        }}
      >
        {/* === Chart 1 === */}
        <div
          className="chart"
          style={{
            flex: "1 1 32%",
            minWidth: "300px",
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 className="chart__title text-center mb-3 font-semibold">
            Consommation par véhicule
          </h3>
          {parVehicule.length > 0 ? (
            <Bar data={vehiculeData} />
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>
              Aucune donnée disponible
            </p>
          )}
        </div>

        {/* === Chart 2 === */}
        <div
          className="chart"
          style={{
            flex: "1 1 32%",
            minWidth: "300px",
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 className="chart__title text-center mb-3 font-semibold">
            Évolution du coût par semaine
          </h3>
          {coutHebdo.length > 0 ? (
            <Line data={coutData} />
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>
              Aucune donnée disponible
            </p>
          )}
        </div>

        {/* === Chart 3 === */}
        <div
          className="chart"
          style={{
            flex: "1 1 32%",
            minWidth: "300px",
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 className="chart__title text-center mb-3 font-semibold">
            Répartition du carburant
          </h3>
          {repartition.length > 0 ? (
            <Pie data={repartitionData} />
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>
              Aucune donnée disponible
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RapportCharts;
