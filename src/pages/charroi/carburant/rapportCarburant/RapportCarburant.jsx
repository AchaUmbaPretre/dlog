import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./rapportCarburant.scss";
import RapportHeader from "./rapportHeader/RapportHeader";
import RapportKPIs from "./rapportKPIs/RapportKPIs";
import RapportCharts from "./rapportCharts/RapportCharts";
import RapportTableVehicules from "./rapportTableVehicules/RapportTableVehicules";
import RapportAlertes from "./rapportAlertes/RapportAlertes";
import { getRapportCarburant } from "../../../../services/carburantService";
import moment from "moment";

const RapportCarburant = ({
  generatedBy = "Système",
  generatedAt = new Date().toLocaleString(),
}) => {
  // Initialiser la période avec la date du jour
  const today = moment().format("YYYY-MM-DD");
  const [period, setPeriod] = useState({ from: today, to: today });
  const [charts, setCharts] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [kpis, setKpis] = useState({});

  // Fetch automatique avec la période par défaut
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getRapportCarburant(period.from, period.to);
        // Supposons que l'API retourne { resume, graphiques, detailVehicules, alertes }
        setKpis(data.resume || {});
        setCharts(data.graphiques || {});
        setVehicles(data.detailVehicules || []);
        setAlerts(data.alertes || []);
      } catch (error) {
        console.error("Erreur lors du chargement du rapport :", error);
      }
    };
    fetchData();
  }, [period]); // Re-exécute si period change

  return (
    <section className="rapport">
      <RapportHeader
        onPeriodChange={period}
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
