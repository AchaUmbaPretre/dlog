import React from "react";

const formatNumber = (v) =>
  v === null || v === undefined ? "-" : new Intl.NumberFormat("fr-FR").format(v);

const RapportTableVehicules = ({ vehicles }) => (
  <section className="card table-card">
    <h2 className="card__title">Détail par véhicule</h2>
    <div className="table-responsive">
      <table className="rapport-table">
        <thead>
          <tr>
            <th>Véhicule</th>
            <th>Catégorie</th>
            <th>Chauffeur</th>
            <th>Dernier KM</th>
            <th>Litres</th>
            <th>Coût (CDF)</th>
            <th>Conso (L/100km)</th>
            <th>Alertes</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr><td colSpan="8" className="empty">Aucun véhicule</td></tr>
          ) : (
            vehicles.map((v) => (
              <tr key={v.vehicule}>
                <td>{v.vehicule}</td>
                <td>{v.categorie}</td>
                <td>{v.chauffeur}</td>
                <td>{formatNumber(v.dernier_km)}</td>
                <td>{formatNumber(v.litres)}</td>
                <td>{formatNumber(v.cout_cdf)}</td>
                <td>{v.conso ?? "-"}</td>
                <td>
                  {v.alertStatus === "OK" && <span className="chip chip--ok">OK</span>}
                  {v.alertStatus === "WARN" && <span className="chip chip--warn">⚠</span>}
                  {v.alertStatus === "CRIT" && <span className="chip chip--crit">❌</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default RapportTableVehicules;
