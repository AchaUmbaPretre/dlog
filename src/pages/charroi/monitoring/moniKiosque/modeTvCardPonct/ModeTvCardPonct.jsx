import { useState, useEffect } from "react";
import { notification, Progress, Tooltip } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from "@ant-design/icons";
import "./modeTvCardPonct.scss";
import { getFalcon } from "../../../../../services/rapportService";

const TrendArrow = ({ previous, current }) => {
  if (previous === null) return current > 0
    ? <ArrowUpOutlined className="trend up" />
    : <MinusOutlined className="trend neutral" />;

  if (current > previous) return <ArrowUpOutlined className="trend up" />;
  if (current < previous) return <ArrowDownOutlined className="trend down" />;
  return <MinusOutlined className="trend neutral" />;
};

const ModeTvCardPonct = ({ datas }) => {
  const [prevData, setPrevData] = useState({ depart: null, attente: null, dispo: null, hors_ligne: null });
  const [data, setData] = useState({ depart: 0, attente: 0, dispo: 0, hors_ligne: 0, departPrecedent: 0, attentePrecedent: 0 });
  const [flash, setFlash] = useState({ depart: "", attente: "", dispo: "", hors_ligne: "" });
  const [falcon, setFalcon] = useState([]);

  const fetchData = async () => {
    try {
      const falconData = await getFalcon();
      const items = falconData.data[0].items || [];
      setFalcon(items);
    } catch (error) {
      console.error("Erreur fetchData:", error);
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger les données véhicules.',
      });
    }
  };

  useEffect(() => { fetchData() }, []);

  useEffect(() => {
    if (!datas) return;

    const enLigne = falcon.filter(f => f.online === "online").length;
    const horsLigne = falcon.filter(f => f.online === "offline").length;
    const totalVehicules = enLigne + horsLigne;

    const newData = {
      depart: Number(datas.depart_actuel || 0),
      attente: Number(datas.attente_actuel || 0),
      dispo: Number(datas.vehicule_dispo || 0),
      hors_ligne: horsLigne,
      departPrecedent: Number(datas.depart_precedent || 0),
      attentePrecedent: Number(datas.attente_precedent || 0),
    };

    setFlash({
      depart: newData.depart !== data.depart ? "flash" : "",
      attente: newData.attente !== data.attente ? "flash" : "",
      dispo: newData.dispo !== data.dispo ? "flash" : "",
      hors_ligne: newData.hors_ligne !== data.hors_ligne ? "flash" : "",
    });

    setPrevData(data);
    setData(newData);

    const timer = setTimeout(() => setFlash({ depart: "", attente: "", dispo: "", hors_ligne: "" }), 600);
    return () => clearTimeout(timer);
  }, [datas, falcon]);

  const getStrokeColor = (value, total = 100) => {
    const percent = total ? (value / total) * 100 : 0;
    return percent >= 90 ? "#52c41a" : percent >= 75 ? "#faad14" : "#ff4d4f";
  };

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
          {previousKey && <TrendArrow previous={data[previousKey]} current={data[key]} />}
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

  const enLigne = falcon.filter(f => f.online === "online").length;
  const horsLigne = falcon.filter(f => f.online === "offline").length;

  return (
    <div className="tv_ponct_container">
      {renderCard("Départs", "depart", "departPrecedent")}
      {renderCard("En attente", "attente", "attentePrecedent")}
      {renderCard("Hors ligne", "hors_ligne", null, enLigne + horsLigne, false)}
      {renderCard("Disponibles", "dispo")}
    </div>
  );
};


export default ModeTvCardPonct;
