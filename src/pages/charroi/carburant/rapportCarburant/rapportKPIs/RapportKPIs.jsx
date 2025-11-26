import React from "react";
import {
  DollarOutlined,
  ShoppingOutlined,
  DashboardOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Skeleton } from "antd";
import "./rapportKPIs.scss";

const formatNumber = (v) =>
  v == null ? "-" : new Intl.NumberFormat("fr-FR").format(v);

const RapportKPIs = ({ kpis, loading }) => {
  const items = [
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
      label: "Consom moyenne",
      value: `${kpis?.conso_moyenne || "-"} L/100km`,
      icon: <DashboardOutlined />,
      color: "#ec4899",
      bg: "#fdf2f8",
    },
  ];

  return (
    <section className="kpis-card">
      <h2 className="kpis-title">Résumé global</h2>

      <div className="kpis-grid">
        {items.map((k, i) => (
          <div className="kpi-card" key={i}>
            <div className="kpi-icon" style={{ background: k.bg, color: k.color }}>
              {k.icon}
            </div>

            <div className="kpi-info">
              <div className="kpi-label">
                {loading ? <Skeleton.Input active size="small" style={{ width: 140 }} /> : k.label}
              </div>

              <div className="kpi-value">
                {loading ? (
                  <Skeleton.Input active size="default" style={{ width: 100, height: 24 }} />
                ) : (
                  k.value
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RapportKPIs;
