import React from "react";

const RapportAlertes = ({ alerts }) => (
  <aside className="card alerts">
    <h2 className="card__title">Alertes détectées</h2>
    <ul className="alerts__list">
      {alerts.length === 0 ? (
        <li className="alerts__empty">Aucune alerte détectée</li>
      ) : (
        alerts.map((a, idx) => (
          <li key={idx} className={`alert-item alert-item--${a.niveau.toLowerCase()}`}>
            <div className="alert-item__meta">
              <strong>{a.vehicule}</strong> •{" "}
              <span>{new Date(a.date).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="alert-item__body">
              <div>{a.message}</div>
              <small>{a.status}</small>
            </div>
          </li>
        ))
      )}
    </ul>
  </aside>
);

export default RapportAlertes;
