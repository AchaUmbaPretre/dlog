import React from "react";
import './rapportKPIs.scss';

const formatNumber = (v) => (v == null ? "-" : new Intl.NumberFormat("fr-FR").format(v));

const RapportKPIs = ({ kpis }) => (
  <section className="card kpis">
    <h2 className="card__title">Résumé global</h2>
    <div className="kpis__grid">
      {[
        { label: "Total des pleins", value: formatNumber(kpis.total_pleins) },
        { label: "Total litres", value: `${formatNumber(kpis.total_litres)} L` },
        { label: "Coût total (CDF)", value: `${formatNumber(kpis.total_cdf)} CDF` },
        { label: "Coût total (USD)", value: `${formatNumber(kpis.total_usd)} USD` },
        { label: "Consomm. moyenne", value: `${kpis.conso_moyenne || "-"} L/100km` },
      ].map((k, i) => (
        <div className="kpi" key={i}>
          <div className="kpi__label">{k.label}</div>
          <div className="kpi__value">{k.value}</div>
        </div>
      ))}
    </div>
  </section>
);

export default RapportKPIs;
