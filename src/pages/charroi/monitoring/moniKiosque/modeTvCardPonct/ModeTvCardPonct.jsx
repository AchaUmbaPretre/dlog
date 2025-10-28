import { useState, useEffect, useCallback, useMemo } from "react";
import { notification, Progress, Tooltip, Modal } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from "@ant-design/icons";
import "./modeTvCardPonct.scss";
import { getFalcon, getRapportCharroiVehicule } from "../../../../../services/rapportService";
import RapportVehiculeCourses from "../rapportVehiculeCourses/RapportVehiculeCourses";
import RapportVehiculeValide from "../../../rapportCharroi/rapportVehiculeValide/RapportVehiculeValide";
import RapportVehiculeDepart from "../rapportVehiculeDepart/RapportVehiculeDepart";

const REFRESH_INTERVAL = 30000;

// --- Composant flèche tendance ---
const TrendArrow = ({ previous, current }) => {
  if (previous === null || previous === undefined) {
    return current > 0 ? (
      <ArrowUpOutlined className="trend up" />
    ) : (
      <MinusOutlined className="trend neutral" />
    );
  }

  if (current > previous) return <ArrowUpOutlined className="trend up" />;
  if (current < previous) return <ArrowDownOutlined className="trend down" />;
  return <MinusOutlined className="trend neutral" />;
};

const ModeTvCardPonct = ({ datas }) => {
  const [data, setData] = useState({
    depart: 0,
    attente: 0,
    course: 0,
    dispo: 0,
    hors_ligne: 0,
    departPrecedent: 0,
    attentePrecedent: 0,
    coursePrecedent: 0,
  });
  const [flash, setFlash] = useState({
    depart: "",
    attente: "",
    course: "",
    dispo: "",
    hors_ligne: "",
  });
  const [falcon, setFalcon] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [courses, setCourses] = useState([]);
  const [departs, setDeparts] = useState([]);

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type) => {
    closeAllModals();
    setModalType(type);
  };

  // --- Récupération des données Falcon ---
  const fetchData = async () => {
    try {
      const response = await getFalcon();
      const items = response?.data?.[0]?.items || [];
      setFalcon(items);
    } catch (error) {
      console.error("Erreur fetchData:", error);
      notification.error({
        message: "Erreur de chargement",
        description: "Impossible de charger les données véhicules.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Mise à jour des KPI quand datas ou falcon changent ---
  useEffect(() => {
    if (!datas) return;

    const enLigne = falcon.filter((f) => f.online === "online").length;
    const horsLigne = falcon.filter((f) => f.online === "offline").length;

    const newData = {
      depart: Number(datas.depart_actuel || 0),
      attente: Number(datas.attente_actuel || 0),
      course: Number(datas.course_actuel || 0),
      dispo: Number(datas.vehicule_dispo || 0),
      hors_ligne: horsLigne,
      departPrecedent: Number(datas.depart_precedent || 0),
      attentePrecedent: Number(datas.attente_precedent || 0),
      coursePrecedent: Number(datas.course_precedent || 0),
    };

    // --- Détection des changements pour flash ---
    setFlash((prev) => ({
      depart: newData.depart !== data.depart ? "flash" : prev.depart,
      attente: newData.attente !== data.attente ? "flash" : prev.attente,
      course: newData.course !== data.course ? "flash" : prev.course,
      dispo: newData.dispo !== data.dispo ? "flash" : prev.dispo,
      hors_ligne:
        newData.hors_ligne !== data.hors_ligne ? "flash" : prev.hors_ligne,
    }));

    setData(newData);

    const timer = setTimeout(
      () =>
        setFlash({
          depart: "",
          attente: "",
          course: "",
          dispo: "",
          hors_ligne: "",
        }),
      600
    );
    return () => clearTimeout(timer);
  }, [datas, falcon]);

    const fetchCourses = useCallback(async () => {
      try {
        const { data } = await getRapportCharroiVehicule();
        setCourses(data?.listeCourse || []);
        setDeparts(data?.listeDepart || [])
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Impossible de charger les données des véhicules.',
        });
        console.error('Erreur lors du chargement des courses:', error);
      }
    }, []);
  
    useEffect(() => {
      const controller = new AbortController();
      fetchCourses();
  
      const interval = setInterval(fetchCourses, REFRESH_INTERVAL);
      return () => {
        controller.abort();
        clearInterval(interval);
      };
    }, [fetchCourses]);

  // --- Couleur de la jauge ---
  const getStrokeColor = (value, total = 100) => {
    const percent = total ? (value / total) * 100 : 0;
    if (percent >= 90) return "#52c41a"; // Vert
    if (percent >= 75) return "#faad14"; // Jaune
    return "#ff4d4f"; // Rouge
  };

  // --- Génération de chaque carte ---
  const renderCard = (title, key, previousKey = null, totalValue = null, showPrevious = true) => (
    <div className={`tv_card kpi_card ${key} ${flash[key]}`}>
      <h3>{title}</h3>
      <div className="tv_card_body">
        <div className="tv_value_wrapper">
          {previousKey ? (
            <Tooltip title={`Valeur précédente : ${data[previousKey] || 0}`}>
              <span className="tv_value">{data[key]}</span>
            </Tooltip>
          ) : (
            <span className="tv_value">{data[key]}</span>
          )}
          {previousKey && (
            <TrendArrow previous={data[previousKey]} current={data[key]} />
          )}
        </div>
        {showPrevious && previousKey && key !== "hors_ligne" && (
          <span className="tv_previous">Hier : {data[previousKey]}</span>
        )}
        <Progress
          percent={totalValue ? (data[key] / totalValue) * 100 : data[key]}
          strokeColor={getStrokeColor(data[key], totalValue || data[key])}
          trailColor="#e0e0e0"
          strokeWidth={14}
          showInfo={false}
          status="active"
        />
      </div>
    </div>
  );

  const enLigne = falcon.filter((f) => f.online === "online").length;
  const horsLigne = falcon.filter((f) => f.online === "offline").length;

    const mergedCourses = useMemo(() => {
      return courses.map((c) => {
        const capteur = falcon.find((f) => f.id === c.id_capteur);
        return { ...c, capteurInfo: capteur || null };
      });
    }, [courses, falcon]);

    const mergedDepart =  useMemo(() => {
      return departs.map((c) => {
        const capteur = falcon.find((f) => f.id === c.id_capteur);
        return { ...c, capteurInfo: capteur || null };
      });
    }, [departs, falcon]);
    
  
  return (
    <>
      <div className="tv_ponct_container">
        <div onClick={() => openModal('depart')} style={{ cursor: 'pointer' }}>
          {renderCard("Départs", "depart", "departPrecedent")}
        </div>
        <div onClick={() => openModal('attente')} style={{ cursor: 'pointer' }}>
          {renderCard("En attente", "attente", "attentePrecedent")}
        </div>
        <div onClick={() => openModal('course')} style={{ cursor: 'pointer' }}>
          {renderCard("Courses", "course", "coursePrecedent")}
        </div>
        <div onClick={() => openModal('hors')} style={{ cursor: 'pointer' }}>
          {renderCard("Hors ligne", "hors_ligne", null, enLigne + horsLigne, false)}
        </div>
        <div onClick={() => openModal('dispo')} style={{ cursor: 'pointer' }}>
          {renderCard("Disponibles", "dispo")}
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'course'}
        onCancel={closeAllModals}
        footer={null}
        width={1325}
        centered
      >
        <RapportVehiculeCourses course={mergedCourses} />
     </Modal>

      <Modal
        title=""
        visible={modalType === 'attente'}
        onCancel={closeAllModals}
        footer={null}
        width={1325}
        centered
      >
        <RapportVehiculeValide />
     </Modal>

           <Modal
        title=""
        visible={modalType === 'depart'}
        onCancel={closeAllModals}
        footer={null}
        width={1350}
        centered
      >
        <RapportVehiculeDepart depart={mergedDepart} />
     </Modal>
    </>
  );
};

export default ModeTvCardPonct;
