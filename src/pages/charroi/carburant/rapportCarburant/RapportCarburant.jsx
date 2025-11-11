import React, { useState, useEffect } from "react";
import moment from "moment";
import { DatePicker, Button } from "antd";
import "antd/dist/reset.css";

import RapportKPIs from "./rapportKPIs/RapportKPIs";
import RapportCharts from "./rapportCharts/RapportCharts";
import RapportTableVehicules from "./rapportTableVehicules/RapportTableVehicules";
import RapportAlertes from "./rapportAlertes/RapportAlertes";
import { getRapportCarburant } from "../../../../services/carburantService";

const { RangePicker } = DatePicker;

const RapportCarburant = ({
  generatedBy = "Système",
  generatedAt = new Date().toLocaleString(),
}) => {
  const today = moment();
  const [dates, setDates] = useState([today, today]);
  const [period, setPeriod] = useState({
    from: today.format("YYYY-MM-DD"),
    to: today.format("YYYY-MM-DD"),
  });

  const [kpis, setKpis] = useState({});
  const [charts, setCharts] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const fetchRapport = async (from, to) => {
    try {
      const { data } = await getRapportCarburant(from, to);
      if (!data) return;

      setKpis({
        totalPleins: data.resume.total_pleins,
        totalLitres: data.resume.total_litres,
        totalCdf: data.resume.total_cdf,
        totalUsd: data.resume.total_usd,
        avgConsumption: data.resume.conso_moyenne,
      });

      setCharts(data.graphiques || {});
      setVehicles(data.detailVehicules || []);
      setAlerts(
        (data.alertes || []).map((a) => ({
          niveau: a.type_alerte,
          vehicule: a.immatriculation,
          date: a.date_operation,
          message: `Consommation: ${a.consommation} L/100km, Quantité: ${a.quantite_litres} L`,
          status: "À vérifier",
        }))
      );
    } catch (error) {
      console.error("Erreur lors du chargement du rapport :", error);
    }
  };

  useEffect(() => {
    fetchRapport(period.from, period.to);
  }, [period]);

  const handleChangeDates = (dates) => setDates(dates);

  const handleGenerate = () => {
    if (dates && dates.length === 2) {
      const from = dates[0].format("YYYY-MM-DD");
      const to = dates[1].format("YYYY-MM-DD");
      setPeriod({ from, to });
    }
  };

  return (
    <section className="rapport">
      <header className="rapport__header">
        <div>
          <h1 className="rapport__title">Rapport de gestion du carburant</h1>

          <div style={{ margin: "10px 0" }}>
            <RangePicker
              format="YYYY-MM-DD"
              value={dates}
              onChange={handleChangeDates}
              allowClear
            />
            <Button
              type="primary"
              style={{ marginLeft: 10 }}
              onClick={handleGenerate}
            >
              Générer le rapport
            </Button>
          </div>

          {dates.length === 2 && (
            <p className="rapport__meta">
              Période sélectionnée : <strong>{dates[0].format("YYYY-MM-DD")}</strong> au{" "}
              <strong>{dates[1].format("YYYY-MM-DD")}</strong>
            </p>
          )}

          <p className="rapport__meta">
            Généré le : <strong>{new Date(generatedAt).toLocaleString("fr-FR")}</strong>
            <span className="rapport__meta-sep">•</span>
            Préparé par : <strong>{generatedBy}</strong>
          </p>
        </div>
      </header>

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
