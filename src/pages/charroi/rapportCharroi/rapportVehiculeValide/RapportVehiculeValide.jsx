import './rapportVehiculeValide.scss';
import { Table, Tag, Tooltip, Space, Typography } from 'antd';
import { 
  CarOutlined, ApartmentOutlined, UserOutlined, FieldTimeOutlined, 
  EnvironmentOutlined, AppstoreOutlined, TrademarkOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

// Texte avec tooltip
const renderTextWithTooltip = (text, color = 'secondary', maxWidth = 160) => (
  <Tooltip title={text}>
    <div style={{ maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Text type={color}>{text}</Text>
    </div>
  </Tooltip>
);

// Date formatée dans un tag
const renderDateTag = (dateStr, color = 'blue') => {
  if (!dateStr) return <Tag color="red">Aucune date</Tag>;
  const date = moment(dateStr);
  return <Tag color={color}>{date.format('DD-MM-YYYY HH:mm')}</Tag>;
};

// Formate une durée en minutes en min / h / jour
const formatDuration = (minutesTotal) => {
  if (minutesTotal == null) return '-';

  if (minutesTotal < 60) return `${minutesTotal} min`;
  
  const jours = Math.floor(minutesTotal / 1440); // 1440 min = 1 jour
  const heures = Math.floor((minutesTotal % 1440) / 60);
  const minutes = minutesTotal % 60;

  let result = '';
  if (jours > 0) result += `${jours} jour${jours > 1 ? 's' : ''} `;
  if (heures > 0) result += `${heures}h`;
  if (minutes > 0) result += `${minutes}m`;
  return result.trim();
};

// Statut BS avec couleur dynamique selon l’heure prévue
const renderStatutBS = (nomStatut, datePrevue) => {
  if (!nomStatut) return <Tag>-</Tag>;
  if (!datePrevue) return <Tag color="green">{nomStatut}</Tag>;

  const now = moment();
  const prevue = moment(datePrevue);
  const diffMinutes = now.diff(prevue, 'minutes');

  let color = 'green'; // par défaut : avant l’heure
  if (diffMinutes > 0 && diffMinutes <= 60) color = 'orange'; // quasi 1h de retard
  else if (diffMinutes > 60) color = 'red'; // plus d’une heure de retard

  return <Tag color={color} style={{ fontWeight: 600 }}>{nomStatut === "BS validé" ? 'En attente' : ''}</Tag>;
};

const RapportVehiculeValide = ({ data }) => {
  const columns = [
    { title: '#', key: 'index', render: (_, __, index) => index + 1, width: 50 },

    {
      title: <Space><AppstoreOutlined style={{ color: '#1890ff' }} /><Text strong>Motif</Text></Space>,
      dataIndex: 'nom_motif_demande',
      key:'nom_motif_demande',
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
    },
    {
      title: <Space><ApartmentOutlined style={{ color: '#1d39c4' }} /><Text strong>Service</Text></Space>,
      dataIndex: 'nom_service',
      key:'nom_service',
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
    },
    {
      title: <Space><UserOutlined style={{ color:'orange' }} /><Text strong>Chauffeur</Text></Space>,
      key:'chauffeur',
      render: (_, record) => renderTextWithTooltip(`${record.prenom_chauffeur} ${record.nom}`),
      ellipsis: true,
    },
    {
      title: <Space><EnvironmentOutlined style={{ color: 'red' }} /><Text strong>Destination</Text></Space>,
      dataIndex: 'nom_destination',
      key:'nom_destination',
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
    },
    {
      title: <Space><CarOutlined style={{ color: 'green' }} /><Text strong>Véhicule</Text></Space>,
      dataIndex:'nom_cat',
      key:'nom_cat',
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
    },
    {
      title: 'Immatriculation',
      dataIndex:'immatriculation',
      key:'immatriculation',
      align: 'center',
      render: (text) => <Tag color='magenta'>{text}</Tag>,
    },
    {
      title: 'Marque',
      dataIndex:'nom_marque',
      key: 'nom_marque',
      align: 'center',
      render: (text) => <Tag icon={<TrademarkOutlined />} color="blue">{text}</Tag>,
    },
    {
      title: 'Sortie prévue',
      dataIndex:'date_prevue',
      key: 'date_prevue',
      align: 'center',
      render: (text) => renderDateTag(text),
    },
    {
      title: 'Retour prévu',
      dataIndex:'date_retour',
      key:'date_retour',
      align: 'center',
      render: (text) => renderDateTag(text),
    },
    {
      title: <Space><FieldTimeOutlined style={{ color:'orange' }} /><Text strong>Statut</Text></Space>,
      key: 'nom_statut_bs',
      render: (_, record) => renderStatutBS(record.nom_statut_bs, record.date_prevue),
    },
/*     {
      title: 'Durée réelle',
      dataIndex: 'duree_reelle_min',
      key: 'duree_reelle_min',
      align: 'center',
      render: (val) => <Tag color="geekblue">{formatDuration(val)}</Tag>,
    }, */
    {
      title: 'Durée moyenne',
      dataIndex: 'duree_moyenne_min',
      key: 'duree_moyenne_min',
      align: 'center',
      render: (val) => <Tag color="purple">{formatDuration(val)}</Tag>,
    },
/*     {
      title: 'Écart',
      dataIndex: 'ecart_min',
      key: 'ecart_min',
      align: 'center',
      render: (val) => {
        if (val == null) return "-";
        const color = val > 0 ? "red" : val < 0 ? "green" : "default";
        const signe = val > 0 ? "+" : "";
        return <Tag color={color}>{signe}{formatDuration(Math.abs(val))}</Tag>;
      },
    }, */
  ];

  return (
    <div className="rapportVehiculeValide">
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record, index) => `${record.immatriculation}-${index}`} // clé unique
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
        bordered
        size="middle"
      />
    </div>
  );
};

export default RapportVehiculeValide;
