import React from "react";
import {
  DollarOutlined,
  ShoppingOutlined,
  DashboardOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import "./rapportKPIs.scss";

const formatNumber = (v) =>
  v == null ? "-" : new Intl.NumberFormat("fr-FR").format(v);

const RapportKPIs = ({ kpis }) => (
  <section className="kpis-card">
    <h2 className="kpis-title">Résumé global</h2>

    <div className="kpis-grid">
      {[
        {
          label: "Total des pleins",
          value: formatNumber(kpis?.total_pleins),
          icon: <ShoppingOutlined />,
          color: "#3b82f6",
          bg: "#eff6ff",
        },
        {
          label: "Total litres",
          value: `${formatNumber(kpis?.total_litres)} L`,
          icon: <ExperimentOutlined />,
          color: "#10b981",
          bg: "#ecfdf5",
        },
        {
          label: "Coût total (CDF)",
          value: `${formatNumber(kpis?.total_cdf)} CDF`,
          icon: <DollarOutlined />,
          color: "#f59e0b",
          bg: "#fffbeb",
        },
        {
          label: "Coût total (USD)",
          value: `${formatNumber(kpis?.total_usd)} USD`,
          icon: <DollarOutlined />,
          color: "#8b5cf6",
          bg: "#f5f3ff",
        },
        {
          label: "Consommation moyenne",
          value: `${kpis?.conso_moyenne || "-"} L/100km`,
          icon: <DashboardOutlined />,
          color: "#ec4899",
          bg: "#fdf2f8",
        },
      ].map((k, i) => (
        <div className="kpi-card" key={i}>
          <div className="kpi-icon" style={{ background: k.bg, color: k.color }}>
            {k.icon}
          </div>
          <div className="kpi-info">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default RapportKPIs;
