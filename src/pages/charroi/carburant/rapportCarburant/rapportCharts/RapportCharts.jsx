import React from "react";

const RapportCharts = () => {
  return (
    <section className="card charts">
      <h2 className="card__title">Graphiques</h2>
      <div className="charts__flex">
        <div className="chart placeholder">
          <h3 className="chart__title">Consommation par véhicule</h3>
        </div>
        <div className="chart placeholder">
          <h3 className="chart__title">Évolution du coût par semaine</h3>
        </div>
        <div className="chart placeholder">
          <h3 className="chart__title">Répartition du carburant par catégorie</h3>
        </div>
      </div>
    </section>
  );
};

export default RapportCharts;
