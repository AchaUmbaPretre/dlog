import { useEffect, useState } from "react";
import "./rapportCharroi.scss";
import { Tabs, Badge, notification } from "antd";
import {
  CheckCircleOutlined,
  CarOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import RapportVehiculeValide from "./rapportVehiculeValide/RapportVehiculeValide";
import RapportVehiculeCourses from "./rapportVehiculeCourses/RapportVehiculeCourses";
import RapportVehiculeUtilitaire from "./rapportVehiculeUtilitaire/RapportVehiculeUtilitaire";
import { getRapportCharroiVehicule } from "../../../services/rapportService";

const RapportCharroi = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);
  const [utilitaire, setUtilitaire] = useState([]);


    const fetchData = async() => {
        try {
            const { data } = await getRapportCharroiVehicule();

            setData(data.listeEnAttente)
            setCourse(data.listeCourse)
            setUtilitaire(data.listeUtilitaire)

        } catch (error) {
            notification.error({
            message: 'Erreur de chargement',
            escription: 'Une erreur est survenue lors du chargement des données.',
            });
        }
    }

  useEffect(() => {
    fetchData()
  }, []);

  // 👉 Exemple de données (tu pourras les remplacer par tes vrais counts depuis l’API)
  const counts = {
    bonsValides: 1,
    vehiculesCourse: 2,
    utilitaires: 1,
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
                  <span>Véhicule en attente de sortie</span>
                </Badge>
              </span>
            }
          >
            <RapportVehiculeValide data={data} />
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
            <RapportVehiculeCourses course={course}/>
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
            <RapportVehiculeUtilitaire utilitaire={utilitaire} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default RapportCharroi;