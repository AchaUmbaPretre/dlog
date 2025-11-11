import React from "react";

const RapportHeader = ({ period, generatedBy, generatedAt }) => {
  return (
    <header className="rapport__header">
      <div>
        <h1 className="rapport__title">Rapport de gestion du carburant</h1>
        <p className="rapport__meta">
          Période : <strong>{period.from}</strong> au <strong>{period.to}</strong>
          <span className="rapport__meta-sep">•</span>
          Généré le : <strong>{new Date(generatedAt).toLocaleString("fr-FR")}</strong>
          <span className="rapport__meta-sep">•</span>
          Préparé par : <strong>{generatedBy}</strong>
        </p>
      </div>
      <div className="rapport__actions">
        <button className="btn btn--primary">Télécharger PDF</button>
        <button className="btn">Imprimer</button>
      </div>
    </header>
  );
};

export default RapportHeader;
