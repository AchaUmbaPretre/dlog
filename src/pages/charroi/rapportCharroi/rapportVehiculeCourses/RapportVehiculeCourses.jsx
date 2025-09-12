import { useEffect, useState } from "react";
import { Table, Tag, Dropdown, Button, Space, Typography, Tooltip, Menu } from "antd";
import {
  CarOutlined,
  ApartmentOutlined,
  UserOutlined,
  EnvironmentOutlined,
  TrademarkOutlined,
  AppstoreOutlined,
  DownOutlined,
  MenuOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

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
      <Text type="secondary">{text}</Text>
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

export const getDurationColor = (elapsedMinutes, datePrevue) => {
  if (!datePrevue) return "default";

  const diff = moment().diff(moment(datePrevue), "minutes");

  if (diff <= 0) return "green";
  if (diff > 25 && diff <= 60) return "orange";
  if (diff > 60) return "red";
  return "green";
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
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Motif': false,
        'Service': true,
        'Chauffeur': true,
        'Destination' : true,
        'Type véhicule' : true,
        'Immatriculation' : false,
        'Marque' : true,
        'Écart': true,
        'Durée': true,
        'Durée moyenne' : true, 
        'Commentaire': false
    });

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
        ...(columnsVisibility['Motif'] ? {} : { className: 'hidden-column' })
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
        ...(columnsVisibility['Service'] ? {} : { className: 'hidden-column' })
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
        ...(columnsVisibility['Chauffeur'] ? {} : { className: 'hidden-column' })
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
        ellipsis: true,
        ...(columnsVisibility['Destination'] ? {} : { className: 'hidden-column' })
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
        ...(columnsVisibility['Type véhicule'] ? {} : { className: 'hidden-column' })
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
        ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' })
    },
    {
      title: "Durée R.",
      key: "duree_reelle_min",
      render: (_, record) => (
        <ChronoTag sortie_time={record.sortie_time} date_prevue={record.date_prevue} />
      ),
        ...(columnsVisibility['Durée'] ? {} : { className: 'hidden-column' })
    },
    {
      title: "Durée M.",
      key: "duree_moyenne_min",
      render: (_, record) => <MoyenneTag duree_moyenne_min={record.duree_moyenne_min} />,
        ...(columnsVisibility['Durée moyenne'] ? {} : { className: 'hidden-column' })
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
          ...(columnsVisibility['Écart'] ? {} : { className: 'hidden-column' })
    },
        {
      title: <Space><FileTextOutlined style={{ color:'orange' }} /><Text strong>Commentaire</Text></Space>,
      key:'commentaire',
      render: (_, record) => renderTextWithTooltip(`${record.commentaire}`),
      ellipsis: true,
        ...(columnsVisibility['Commentaire'] ? {} : { className: 'hidden-column' })
    }
  ];

   const toggleColumnVisibility = (columnName, e) => {
        e.stopPropagation();
        setColumnsVisibility(prev => ({
        ...prev,
        [columnName]: !prev[columnName]
        }));
    };

    const menus = (
    <Menu>
      {Object.keys(columnsVisibility).map(columnName => (
        <Menu.Item key={columnName}>
          <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
            <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
            <span style={{ marginLeft: 8 }}>{columnName}</span>
          </span>
        </Menu.Item>
      ))}
    </Menu>
    );

  return (
    <div className="rapportVehiculeValide">
        <div className="colonne-filtre">
            <Dropdown overlay={menus} trigger={['click']} placement="bottomRight" arrow>
                <Button
                    icon={<MenuOutlined />}
                    className="colonne-filtre-btn"
                    type="primary"
                >
                    Colonnes <DownOutlined />
                </Button>
            </Dropdown>
        </div>
        <Table
            columns={columns}
            dataSource={course}
            rowKey={(record) => record.id_vehicule}
            pagination={{ pageSize: 15 }}
            scroll={{ x: "max-content" }}
            bordered
            size="middle"
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
        />
    </div>
  );
};

export default RapportVehiculeCourses;
