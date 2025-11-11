import React from "react";

const RapportTableVehicules = ({ vehicles }) => (
  <section className="card vehicles">
    <h2 className="card__title">Détails des véhicules</h2>
    <table className="vehicles__table">
      <thead>
        <tr>
          <th>Immatriculation</th>
          <th>Marque</th>
          <th>Total litres</th>
          <th>Total CDF</th>
          <th>Total USD</th>
          <th>Conso moyenne</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.length === 0 ? (
          <tr>
            <td colSpan="6">Aucun véhicule trouvé</td>
          </tr>
        ) : (
          vehicles.map((v, idx) => (
            <tr key={idx}>
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
  </section>
);

export default RapportTableVehicules;
