import { useEffect, useState } from "react";
import { Timeline, Tooltip, Card, Badge, Spin, Empty, message } from "antd";
import {
  CarOutlined,
  AlertOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./alertTimeline.scss";
import { getAlertVehicule, markAlertAsRead } from "../../../../../services/alertService";

const AlertTimeline = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    try {
      const { data } = await getAlertVehicule();
      setAlerts(data);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement des alertes");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAlertAsRead(id);
      message.success("Alerte marquée comme lue ✅");
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error(error);
      message.error("Impossible de mettre à jour l'alerte");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      await fetchAlerts();
      setLoading(false);
    };
    loadData();

    const interval = setInterval(() => {
      if (isMounted) fetchAlerts();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getIconColor = (level, resolved) => resolved
    ? "#52c41a"
    : level === "Critique" ? "#ff4d4f" 
    : level === "Important" ? "#fa8c16" 
    : "#1890ff";

  const getBadgeColor = (level) => level === "Critique" ? "red" 
    : level === "Important" ? "orange" 
    : "blue";

  return (
    <div className="alert-timeline-container">
      <Card
        title={
          <span className="card-title">
            🚨 Alertes véhicules{" "}
            <Badge
              count={alerts.length}
              style={{
                backgroundColor: "#f5222d",
                fontSize: 18,
                minWidth: 28,
                height: 28,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </span>
        }
        bordered={false}
        className="alert-card"
      >
        {loading ? (
          <div className="loading-state">
            <Spin size="large" />
            <span>Chargement des alertes...</span>
          </div>
        ) : alerts.length === 0 ? (
          <Empty description="Aucune alerte disponible" />
        ) : (
          <Timeline mode="left" className="alert-timeline">
            {alerts.map(alert => (
              <Timeline.Item
                key={alert.id}
                dot={
                  alert.resolved ? (
                    <CheckCircleOutlined style={{ fontSize: 22, color: getIconColor("", true) }} />
                  ) : (
                    <AlertOutlined style={{ fontSize: 22, color: getIconColor(alert.alert_level) }} />
                  )
                }
              >
                <div className={`alert-content ${alert.resolved ? "resolved" : "unresolved"}`}>
                  <div className="alert-header">
                    <strong>{alert.device_name}</strong>
                    {!alert.resolved && (
                      <Tooltip title="Marquer comme lue">
                        <CheckCircleOutlined
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="icon-mark-read"
                        />
                      </Tooltip>
                    )}
                  </div>
                  <div className="alert-message">
                    <CarOutlined /> {alert.alert_message}
                  </div>
                  <div className="alert-footer">
                    <Tooltip title="Heure de l'alerte">
                      <span>{moment(alert.alert_time).format("DD/MM/YYYY HH:mm")}</span>
                    </Tooltip>
                    <Badge color={getBadgeColor(alert.alert_level)} text={alert.resolved ? "Résolue" : alert.alert_level} />
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    </div>
  );
};

export default AlertTimeline;
