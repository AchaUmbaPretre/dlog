import React from "react";
import {
  ExclamationCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Tag, Empty, Tooltip } from "antd";
import "./rapportAlertes.scss";

const RapportAlertes = ({ alerts = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case "Surconsommation":
        return <ExclamationCircleOutlined className="alert-item__icon critical" />;
      case "Avertissement":
        return <WarningOutlined className="alert-item__icon warning" />;
      default:
        return <CheckCircleOutlined className="alert-item__icon normal" />;
    }
  };

  return (
    <aside className="card alerts">
      <h2 className="card__title">Alertes détectées</h2>

      {alerts.length === 0 ? (
        <div className="alerts__empty">
          <Empty description="Aucune alerte détectée" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <ul className="alerts__list">
          {alerts.map((a, idx) => (
            <li
              key={idx}
              className={`alert-item alert-item--${
                a.type_alerte === "Surconsommation" ? "critical" : "warning"
              }`}
            >
              <div className="alert-item__header">
                {getIcon(a.type_alerte)}
                <div className="alert-item__info">
                  <strong className="alert-item__vehicle">{a.immatriculation}</strong>
                  <Tag
                    color={
                      a.type_alerte === "Surconsommation" ? "error" : "orange"
                    }
                    className="alert-item__tag"
                  >
                    {a.type_alerte}
                  </Tag>
                </div>
                <Tooltip title="Date de l'opération">
                  <span className="alert-item__date">
                    {new Date(a.date_operation).toLocaleDateString("fr-FR")}
                  </span>
                </Tooltip>
              </div>

              <div className="alert-item__body">
                <span>Consommation : </span>
                <strong>{a.consommation} L/100km</strong>
                <span className="alert-item__sep">•</span>
                <span>Quantité : </span>
                <strong>{a.quantite_litres} L</strong>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default RapportAlertes;
