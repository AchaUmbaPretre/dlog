import React from "react";
import { Timeline, Tag, Card, Tooltip } from "antd";
import {
  FileTextOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./departHorsTiming.scss";

const DepartHorsTiming = ({ departHorsTimingRow }) => {
  return (
    <div className="departHorsTiming-container">
      <Card title="🚛 Départs hors timing" bordered={false} className="event-card">
        <div className="departHorsTiming-scroll">
          <Timeline mode="left" className="departHorsTiming-timeline">
            {departHorsTimingRow.map((item) => (
              <Timeline.Item
                key={item.id_bande_sortie}
                dot={
                  item.statut === "OK" ? (
                    <CheckCircleOutlined style={{ fontSize: "18px", color: "#52c41a" }} />
                  ) : (
                    <ClockCircleOutlined style={{ fontSize: "18px", color: "#ff4d4f" }} />
                  )
                }
              >
                <div className="departHorsTiming-content">
                  <div className="departHorsTiming-header">
                    <FileTextOutlined className="departHorsTiming-icon bon" />
                    <span className="departHorsTiming-numBon">{item.nom_destination}</span>
                  </div>

                  <div className="departHorsTiming-sub">
                    <CarOutlined className="departHorsTiming-icon car" />
                    <span className="departHorsTiming-immatriculation">{item.immatriculation}</span>
                  </div>

                  <div className="departHorsTiming-footer">
                    <Tooltip title="Heure de départ prévue">
                      <span className="departHorsTiming-date">
                        {moment(item.date_prevue).format("DD/MM/YYYY HH:mm")}
                      </span>
                    </Tooltip>
                    {item.statut === "Valide" ? (
                      <Tag icon={<CheckCircleOutlined />} color="success" className="departHorsTiming-tag">
                        Valide
                      </Tag>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error" className="departHorsTiming-tag">
                        En retard
                      </Tag>
                    )}
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </Card>
    </div>
  );
};

export default DepartHorsTiming;
