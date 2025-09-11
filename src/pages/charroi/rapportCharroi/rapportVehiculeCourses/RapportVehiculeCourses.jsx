import { useEffect, useState } from "react";
import { Table, Tag, Space, Typography, Tooltip } from "antd";
import {
  CarOutlined,
  ApartmentOutlined,
  UserOutlined,
  EnvironmentOutlined,
  TrademarkOutlined,
  AppstoreOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

// ---------- Utilitaires ----------
const renderTextWithTooltip = (text, maxWidth = 160) => (
  <Tooltip title={text}>
    <div
      style={{
        maxWidth,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      <Text>{text}</Text>
    </div>
  </Tooltip>
);

const formatDuration = (minutes) => {
  if (minutes == null) return "-";
  const totalMinutes = Math.floor(minutes); // on arrondit à l'entier
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const mins = totalMinutes % 60;

  let result = "";
  if (days > 0) result += `${days}j `;
  if (hours > 0) result += `${hours}h `;
  result += `${mins}m`;

  return result.trim();
};

const getDurationColor = (elapsedMinutes, datePrevue) => {
  if (!datePrevue) return "default";
  const diff = moment().diff(moment(datePrevue), "minutes");
  if (diff <= 0) return "green";
  if (diff > 0 && diff <= 60) return "orange";
  return "red";
};

const useElapsedTime = (startTime) => {
  const [elapsed, setElapsed] = useState(0); // en minutes

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const diffMinutes = Math.floor(moment().diff(moment(startTime), "minutes", true)); // arrondi à l'entier
      setElapsed(diffMinutes);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return elapsed;
};

const ChronoTag = ({ sortie_time, date_prevue }) => {
  const elapsedMinutes = useElapsedTime(sortie_time);
  const color = getDurationColor(elapsedMinutes, date_prevue);

  return (
    <Tag color={color} style={{ fontWeight: 600 }}>
      {formatDuration(elapsedMinutes)}
    </Tag>
  );
};

const MoyenneTag = ({ duree_moyenne_min }) => (
  <Tag color="purple">{formatDuration(duree_moyenne_min)}</Tag>
);

const EcartTag = ({ duree_reelle_min, duree_moyenne_min }) => {
  const diff = duree_reelle_min - duree_moyenne_min;
  let color = "green"; // gain de temps
  if (diff > 0 && diff < 60) color = "orange"; // petit retard
  if (diff >= 60) color = "red"; // retard significatif
  const signe = diff > 0 ? "+" : "";
  return <Tag color={color}>{signe}{formatDuration(Math.abs(diff))}</Tag>;
};

const RapportVehiculeCourses = ({ course }) => {
  const columns = [
    { title: "#", key: "index", render: (_, __, index) => index + 1, width: 50 },
    {
      title: (
        <Space>
          <AppstoreOutlined style={{ color: "#1890ff" }} />
          <Text strong>Motif</Text>
        </Space>
      ),
      dataIndex: "nom_motif_demande",
      key: "nom_motif_demande",
      render: (text) => renderTextWithTooltip(text),
    },
    {
      title: (
        <Space>
          <ApartmentOutlined style={{ color: "#1d39c4" }} />
          <Text strong>Service</Text>
        </Space>
      ),
      dataIndex: "nom_service",
      key: "nom_service",
      render: (text) => renderTextWithTooltip(text),
    },
    {
      title: (
        <Space>
          <UserOutlined style={{ color: "orange" }} />
          <Text strong>Chauffeur</Text>
        </Space>
      ),
      dataIndex: "nom",
      key: "nom",
      render: (_, record) =>
        renderTextWithTooltip(`${record.prenom_chauffeur} ${record.nom}`),
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined style={{ color: "red" }} />
          <Text strong>Destination</Text>
        </Space>
      ),
      dataIndex: "nom_destination",
      key: "nom_destination",
      render: (text) => renderTextWithTooltip(text),
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: "green" }} />
          <Text strong>Véhicule</Text>
        </Space>
      ),
      dataIndex: "nom_cat",
      key: "nom_cat",
      render: (text) => renderTextWithTooltip(text),
    },
    {
      title: "Immatriculation",
      dataIndex: "immatriculation",
      key: "immatriculation",
      render: (text) => <Tag color="magenta">{text}</Tag>,
    },
    {
      title: "Marque",
      dataIndex: "nom_marque",
      key: "nom_marque",
      render: (text) => (
        <Tag icon={<TrademarkOutlined />} color="blue">
          {text}
        </Tag>
      ),
    },
    {
      title: "Durée",
      key: "duree_reelle_min",
      render: (_, record) => (
        <ChronoTag sortie_time={record.sortie_time} date_prevue={record.date_prevue} />
      ),
    },
    {
      title: "Durée moyenne",
      key: "duree_moyenne_min",
      render: (_, record) => <MoyenneTag duree_moyenne_min={record.duree_moyenne_min} />,
    },
    {
      title: "Écart",
      key: "ecart_min",
      render: (_, record) => (
        <EcartTag
          duree_reelle_min={record.duree_reelle_min}
          duree_moyenne_min={record.duree_moyenne_min}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={course}
      rowKey={(record) => record.id_vehicule}
      pagination={{ pageSize: 10 }}
      scroll={{ x: "max-content" }}
      bordered
      size="middle"
    />
  );
};

export default RapportVehiculeCourses;
