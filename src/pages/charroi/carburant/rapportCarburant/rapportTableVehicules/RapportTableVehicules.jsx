import React from "react";

const RapportTableVehicules = ({ vehicles }) => (
  <section className="card table-card">
    <h2 className="card__title">Détails des véhicules</h2>
    <div className="table-responsive">
      <table className="rapport-table">
        <thead>
          <tr>
            <th>Immatriculation</th>
            <th>Marque</th>
            <th>Total litres</th>
            <th>Total CDF</th>
            <th>Total USD</th>
            <th>Conso Moyenne</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr><td colSpan={6} className="empty">Aucun véhicule</td></tr>
          ) : (
            vehicles.map((v, i) => (
              <tr key={i}>
                <td>{v.immatriculation}</td>
                <td>{v.nom_marque}</td>
                <td>{v.total_litres}</td>
                <td>{v.total_cdf}</td>
                <td>{v.total_usd}</td>
                <td>{v.conso_moyenne}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default RapportTableVehicules;
