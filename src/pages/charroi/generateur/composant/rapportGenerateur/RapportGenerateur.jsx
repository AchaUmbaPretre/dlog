import React, { useEffect, useState } from 'react'
import RapportHeader from '../../../carburant/rapportCarburant/rapportHeader/RapportHeader'
import moment from 'moment';
import { getRapportPleinGenerateur } from '../../../../../services/generateurService';
import RapportKPIsGenerateur from './rapportKPIsGenerateur/RapportKPIsGenerateur';
import RapportChartsGenerateur from './rapportChartsGenerateur/RapportChartsGenerateur';

const RapportGenerateur = () => {
      const today = moment();
      const [period, setPeriod] = useState([today.clone().startOf("month"), today]);
      const [kpis, setKpis] = useState({});
      const [charts, setCharts] = useState({});
      const [generateurs, setGenerateurs] = useState([]);
      const [alerts, setAlerts] = useState([]);
      const [loading, setLoading] = useState(false);

      
        useEffect(() => {
          const fetchData = async () => {
              setLoading(true);
            try {
              const from = period[0].format("YYYY-MM-DD");
              const to = period[1].format("YYYY-MM-DD");
      
              const { data } = await getRapportPleinGenerateur(from, to);
      
              setKpis(data.resume || {});
              setCharts(data.graphiques || {});
              setGenerateurs(data.detailGenerateurs || []);
            } catch (error) {
              console.error("Erreur chargement rapport :", error);
            } finally {
              setLoading(false);
              }
          };
      
          fetchData();
        }, [period]);

  return (
    <>
        <div className="rapport">
            <RapportHeader
                title = 'RAPPORT GENERAL DU PLEIN GENERATEUR'
                onPeriodChange={(dates) => setPeriod([moment(dates[0]), moment(dates[1])])}
                alertCount={alerts.length}
            />
            <div className="rapport__grid">
                <RapportKPIsGenerateur kpis={kpis} loading={loading}/>
                <RapportChartsGenerateur charts={charts} />
            </div>
        </div>
    </>
  )
}

export default RapportGenerateur