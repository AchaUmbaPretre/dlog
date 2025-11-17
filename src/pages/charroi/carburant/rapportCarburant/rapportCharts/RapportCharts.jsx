import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
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
    <section className="card charts">
      <h2 className="card__title">
        <BarChartOutlined /> Graphiques
      </h2>

      <div className="charts__flex">

        <div className="chart chart--primary chart--small">
            <h3 className="chart__title"><InfoCircleOutlined /> Consommation par véhicule</h3>
            {parVehicule.length > 0 ? <Bar data={vehiculeData} /> : <p className="chart__empty">Aucune donnée disponible</p>}
        </div>

        <div className="charts__right">
            <div className="chart chart--secondary">
            <h3 className="chart__title"><LineChartOutlined /> Évolution du coût par semaine</h3>
            {coutHebdo.length > 0 ? <Line data={coutData} /> : <p className="chart__empty">Aucune donnée disponible</p>}
            </div>

            <div className="chart chart--tertiary">
            <h3 className="chart__title"><PieChartOutlined /> Répartition du carburant</h3>
            {repartition.length > 0 ? <Pie data={repartitionData} /> : <p className="chart__empty">Aucune donnée disponible</p>}
            </div>
        </div>
      </div>

    </section>
  );
};

export default RapportCharts;
