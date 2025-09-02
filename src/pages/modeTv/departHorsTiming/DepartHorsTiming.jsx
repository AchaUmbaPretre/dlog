import { Timeline, Tag, Card, Tooltip } from "antd";
import {
  FileTextOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./departHorsTiming.scss";

const DepartHorsTiming = () => {
  const data = [
    { key: "1", numBon: "BN-2025-001", immatriculation: "ABC-1234", statut: "En retard", date: "02/09/2025 - 08:30" },
    { key: "2", numBon: "BN-2025-002", immatriculation: "XYZ-5678", statut: "Valide", date: "02/09/2025 - 09:10" },
    { key: "3", numBon: "BN-2025-003", immatriculation: "LMN-9012", statut: "En retard", date: "02/09/2025 - 09:45" },
    { key: "4", numBon: "BN-2025-004", immatriculation: "KLM-4321", statut: "En retard", date: "02/09/2025 - 10:15" },
    { key: "5", numBon: "BN-2025-005", immatriculation: "QWE-8765", statut: "Valide", date: "02/09/2025 - 10:40" },
  ];

  return (
    <div className="departHorsTiming-container">
      <Card
        title="🚛 Départs hors timing"
        bordered={false}
        className="event-card"
      >
        <div className="departHorsTiming-scroll">
          <Timeline mode="left" className="departHorsTiming-timeline">
            {data.map((item) => (
              <Timeline.Item
                key={item.key}
                dot={
                  item.statut === "Valide" ? (
                    <CheckCircleOutlined style={{ fontSize: "18px", color: "#52c41a" }} />
                  ) : (
                    <ClockCircleOutlined style={{ fontSize: "18px", color: "#ff4d4f" }} />
                  )
                }
              >
                <div className="departHorsTiming-content">
                  <div className="departHorsTiming-header">
                    <FileTextOutlined className="departHorsTiming-icon bon" />
                    <span className="departHorsTiming-numBon">{item.numBon}</span>
                  </div>

                  <div className="departHorsTiming-sub">
                    <CarOutlined className="departHorsTiming-icon car" />
                    <span className="departHorsTiming-immatriculation">{item.immatriculation}</span>
                  </div>

                  <div className="departHorsTiming-footer">
                    <Tooltip title="Heure de départ prévue">
                      <span className="departHorsTiming-date">{item.date}</span>
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
