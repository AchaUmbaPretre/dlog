import React from "react";

const RapportAlertes = ({ alerts }) => (
  <aside className="card alerts">
    <h2 className="card__title">Alertes détectées</h2>
    <ul className="alerts__list">
      {alerts.length === 0 ? (
        <li className="alerts__empty">Aucune alerte détectée</li>
      ) : (
        alerts.map((a, idx) => (
          <li key={idx} className={`alert-item alert-item--${a.type_alerte === "Surconsommation" ? "critical" : "warning"}`}>
            <div className="alert-item__meta">
              <strong>{a.immatriculation}</strong> • <span>{new Date(a.date_operation).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="alert-item__body">
              Consommation : {a.consommation} L/100km, Quantité : {a.quantite_litres} L
            </div>
          </li>
        ))
      )}
    </ul>
  </aside>
);

export default RapportAlertes;
