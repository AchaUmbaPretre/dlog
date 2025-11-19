import React, { useState, useEffect } from "react";
import moment from "moment";
import { Tabs } from 'antd';
import "./rapportCarburant.scss";
import RapportHeader from "./rapportHeader/RapportHeader";
import RapportKPIs from "./rapportKPIs/RapportKPIs";
import RapportCharts from "./rapportCharts/RapportCharts";
import RapportTableVehicules from "./rapportTableVehicules/RapportTableVehicules";
import RapportAlertes from "./rapportAlertes/RapportAlertes";
import { getRapportCarburant } from "../../../../services/carburantService";
import { getTabStyle, iconStyle } from "../../../../utils/tabStyles";
import {
  FileTextOutlined
} from '@ant-design/icons';
import RapportConsomCarburant from "../rapportConsomCarburant/RapportConsomCarburant";
import RapportPeriode from "./rapportPeriode/RapportPeriode";

const RapportCarburant = () => {
  const today = moment();
  const [period, setPeriod] = useState([today.clone().startOf("month"), today]);
  const [kpis, setKpis] = useState({});
  const [charts, setCharts] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeKey, setActiveKey] = useState('1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
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
      } finally {
        setLoading(false);
        }
    };

    fetchData();
  }, [period]);

  return (
    <>
        <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            type="card"
            tabPosition="top"
            destroyInactiveTabPane
            animated
        >
            <Tabs.TabPane
                key="1"
                tab={
                    <span style={getTabStyle('1', activeKey)}>
                        <FileTextOutlined style={iconStyle('1', activeKey)} />
                        Rapport général
                    </span>
                }
            >
                <section className="rapport">
                    <RapportHeader
                        onPeriodChange={(dates) => setPeriod([moment(dates[0]), moment(dates[1])])}
                        alertCount={alerts.length}
                    />
                    <div className="rapport__grid">
                        <RapportKPIs kpis={kpis} loading={loading} />
                        <RapportCharts charts={charts} />
                        <RapportTableVehicules vehicles={vehicles} />
                        <RapportAlertes alerts={alerts} />
                    </div>
                </section>
            </Tabs.TabPane>
            <Tabs.TabPane
                key="2"
                tab={
                    <span style={getTabStyle('2', activeKey)}>
                    <FileTextOutlined style={iconStyle('2', activeKey)} />
                        Rapport de consommation
                    </span>
                }
            >
                <RapportConsomCarburant />
            </Tabs.TabPane>

            <Tabs.TabPane
                key="3"
                tab={
                    <span style={getTabStyle('3', activeKey)}>
                    <FileTextOutlined style={iconStyle('3', activeKey)} />
                        Rapport par periode
                    </span>
                }
            >
                <RapportPeriode />
            </Tabs.TabPane>
        </Tabs>
    </>
  );
};

export default RapportCarburant;
