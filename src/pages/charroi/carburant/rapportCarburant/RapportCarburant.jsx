import React from "react";
import PropTypes from "prop-types";
import "./rapportCarburant.scss";
import RapportHeader from "./rapportHeader/RapportHeader";
import RapportKPIs from "./rapportKPIs/RapportKPIs";
import RapportCharts from "./rapportCharts/RapportCharts";
import RapportTableVehicules from "./rapportTableVehicules/RapportTableVehicules";
import RapportAlertes from "./rapportAlertes/RapportAlertes";

const RapportCarburant = ({
  period = {}, // valeurs par défaut sécurisées
  generatedBy = "Système",
  generatedAt = new Date().toLocaleString(),
  kpis = {},
  charts = {},
  vehicles = [],
  alerts = [],
}) => {
  return (
    <section className="rapport">
      <RapportHeader
        period={period}
        generatedBy={generatedBy}
        generatedAt={generatedAt}
      />

      <div className="rapport__grid">
        <RapportKPIs kpis={kpis} />
        <RapportCharts charts={charts} />
        <RapportTableVehicules vehicles={vehicles} />
        <RapportAlertes alerts={alerts} />
      </div>
    </section>
  );
};

RapportCarburant.propTypes = {
  period: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  generatedBy: PropTypes.string,
  generatedAt: PropTypes.string,
  kpis: PropTypes.shape({
    totalPleins: PropTypes.number,
    coutCDF: PropTypes.number,
    coutUSD: PropTypes.number,
    totalLitres: PropTypes.number,
    consoMoyenne: PropTypes.number,
  }),
  charts: PropTypes.object,
  vehicles: PropTypes.array,
  alerts: PropTypes.array,
};

export default RapportCarburant;
