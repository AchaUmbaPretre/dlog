import React from "react";
import {
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Tag, Empty, Tooltip } from "antd";
import "./rapportAlertes.scss";

const RapportAlertes = ({ alerts = [] }) => {
  const getIcon = (niveau) => {
    switch (niveau) {
      case "Critical":
        return <CloseCircleOutlined className="alert-item__icon critical" />;
      case "Warning":
        return <WarningOutlined className="alert-item__icon warning" />;
      case "Info":
      default:
        return <InfoCircleOutlined className="alert-item__icon info" />;
    }
  };

  const getTagColor = (niveau) => {
    switch (niveau) {
      case "Critical":
        return "error";
      case "Warning":
        return "warning";
      case "Info":
      default:
        return "blue";
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
            <li key={idx} className={`alert-item alert-item--${a.niveau.toLowerCase()}`}>
              <div className="alert-item__header">
                {getIcon(a.niveau)}
                <div className="alert-item__info">
                  <strong className="alert-item__vehicle">{a.immatriculation}</strong>
                  <Tag color={getTagColor(a.niveau)} className="alert-item__tag">
                    {a.niveau}
                  </Tag>
                  <Tag color={a.status === "Ouverte" ? "cyan" : "green"} className="alert-item__tag-status">
                    {a.status}
                  </Tag>
                </div>
                <Tooltip title="Date de création">
                  <span className="alert-item__date">
                    {new Date(a.created_at).toLocaleString("fr-FR")}
                  </span>
                </Tooltip>
              </div>

              <div className="alert-item__body">
                {a.message}
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default RapportAlertes;
