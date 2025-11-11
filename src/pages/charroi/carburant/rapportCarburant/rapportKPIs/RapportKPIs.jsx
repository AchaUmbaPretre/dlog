import React from "react";

const formatNumber = (v) =>
  v === null || v === undefined ? "-" : new Intl.NumberFormat("fr-FR").format(v);

const RapportKPIs = ({ kpis }) => {
  const kpiItems = [
    { label: "Total des pleins", value: formatNumber(kpis.totalPleins) },
    { label: "Total litres", value: `${formatNumber(kpis.totalLitres)} L` },
    { label: "Coût total (CDF)", value: `${formatNumber(kpis.totalCdf)} CDF` },
    { label: "Coût total (USD)", value: `${formatNumber(kpis.totalUsd)} USD` },
    { label: "Consomm. moyenne", value: kpis.avgConsumption ? `${kpis.avgConsumption} L/100km` : "-" },
  ];

  return (
    <section className="card kpis">
      <h2 className="card__title">Résumé global</h2>
      <div className="kpis__grid">
        {kpiItems.map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi__label">{k.label}</div>
            <div className="kpi__value">{k.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RapportKPIs;
