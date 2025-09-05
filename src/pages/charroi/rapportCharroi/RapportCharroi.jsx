import { useState } from "react";
import "./rapportCharroi.scss";
import { Tabs, Badge } from "antd";
import {
  CheckCircleOutlined,
  CarOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import RapportVehiculeValide from "./rapportVehiculeValide/RapportVehiculeValide";
import RapportVehiculeCourses from "./rapportVehiculeCourses/RapportVehiculeCourses";
import RapportVehiculeUtilitaire from "./rapportVehiculeUtilitaire/RapportVehiculeUtilitaire";

const RapportCharroi = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [count, setCount] = useState(0);

  // 👉 Exemple de données (tu pourras les remplacer par tes vrais counts depuis l’API)
  const counts = {
    bonsValides: 12,
    vehiculesCourse: 5,
    utilitaires: 8,
  };

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
                <CheckCircleOutlined style={{ color: "#52c41a" }} />{" "}
                <Badge count={counts.bonsValides} offset={[8, -2]}>
                  <span>Liste des bons validés</span>
                </Badge>
              </span>
            }
          >
            <RapportVehiculeValide/>
          </Tabs.TabPane>

          <Tabs.TabPane
            key="2"
            tab={
              <span>
                <CarOutlined style={{ color: "#1890ff" }} />{" "}
                <Badge count={counts.vehiculesCourse} offset={[8, -2]}>
                  <span>Véhicules en course</span>
                </Badge>
              </span>
            }
          >
            <RapportVehiculeCourses/>
          </Tabs.TabPane>

          <Tabs.TabPane
            key="3"
            tab={
              <span>
                <ToolOutlined style={{ color: "#faad14" }} />{" "}
                <Badge count={counts.utilitaires} offset={[8, -2]}>
                  <span>Liste des utilitaires</span>
                </Badge>
              </span>
            }
          >
            <RapportVehiculeUtilitaire/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default RapportCharroi;