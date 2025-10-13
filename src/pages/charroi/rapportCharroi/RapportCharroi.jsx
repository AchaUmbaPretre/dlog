import { useEffect, useState } from "react";
import "./rapportCharroi.scss";
import { Tabs, notification } from "antd";
import {
  ToolOutlined,
} from "@ant-design/icons";
import RapportVehiculeUtilitaire from "./rapportVehiculeUtilitaire/RapportVehiculeUtilitaire";
import { getRapportCharroiVehicule } from "../../../services/rapportService";

const RapportCharroi = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [count, setCount] = useState([]);
  const [data, setData] = useState([]);
  const [utilitaire, setUtilitaire] = useState([]);


    const fetchData = async() => {
        try {
            const { data } = await getRapportCharroiVehicule();

            setData(data.listeEnAttente);
            setUtilitaire(data.listeUtilitaire);
            setCount(data?.countUtilitaire[0]?.count_utilitaire)

        } catch (error) {
            notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
            });
        }
    }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <div className="rapport_charroi">
      <div className="rapport_charroi_wrapper">
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          type="card"
          tabPosition="top"
        >

          <Tabs.TabPane
            key="1"
            tab={
              <span>
                <ToolOutlined style={{ color: "#faad14" }} />{" "}
                  <span>Liste des utilitaires</span>
              </span>
            }
          >
            <RapportVehiculeUtilitaire utilitaire={utilitaire} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default RapportCharroi;