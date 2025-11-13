import React, { useState, useEffect } from "react";
import moment from "moment";
import "./rapportCarburant.scss";
import RapportHeader from "./rapportHeader/RapportHeader";
import RapportKPIs from "./rapportKPIs/RapportKPIs";
import RapportCharts from "./rapportCharts/RapportCharts";
import RapportTableVehicules from "./rapportTableVehicules/RapportTableVehicules";
import RapportAlertes from "./rapportAlertes/RapportAlertes";
import { getRapportCarburant } from "../../../../services/carburantService";

const RapportCarburant = () => {
  const today = moment();
  const [period, setPeriod] = useState([today.clone().startOf("month"), today]);
  const [kpis, setKpis] = useState({});
  const [charts, setCharts] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Convertir les dates en format YYYY-MM-DD pour l'API
        const from = period[0].format("YYYY-MM-DD");
        const to = period[1].format("YYYY-MM-DD");

        const { data } = await getRapportCarburant(from, to);

        setKpis(data.resume || {});
        setCharts(data.graphiques || {});
        setVehicles(data.detailVehicules || []);
        setAlerts(data.alertes || []);
      } catch (error) {
        console.error("Erreur chargement rapport :", error);
      }
    };

    fetchData();
  }, [period]);

  return (
    <section className="rapport">
      <RapportHeader
        onPeriodChange={(dates) => setPeriod([moment(dates[0]), moment(dates[1])])}
        alertCount={alerts.length}
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

export default RapportCarburant;
