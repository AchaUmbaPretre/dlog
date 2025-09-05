import { statusIcons } from '../../../../utils/prioriteIcons';
import './rapportVehiculeValide.scss';
import { Table, Tag, Tooltip, Space, Typography } from 'antd';
import { 
  CarOutlined, ApartmentOutlined, UserOutlined, FieldTimeOutlined, 
  EnvironmentOutlined, CalendarOutlined, CheckCircleOutlined, TrademarkOutlined, AppstoreOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

/**
 * Rend un texte avec tooltip et ellipsis pour colonnes longues
 */
const renderTextWithTooltip = (text, color = 'secondary', maxWidth = 160) => (
  <Tooltip title={text}>
    <div style={{ maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Text type={color}>{text}</Text>
    </div>
  </Tooltip>
);

/**
 * Rend une date formatée dans un tag
 */
const renderDateTag = (dateStr, color = 'blue') => {
  if (!dateStr) return <Tag color="red">Aucune date</Tag>;
  const date = moment(dateStr);
  return <Tag color={color}>{date.format('DD-MM-YYYY HH:mm')}</Tag>;
};

/**
 * Rend le statut de sortie avec coloration dynamique selon le retard
 */
const renderStatutSortie = (statut_sortie, duree_retard) => {
  if (!statut_sortie) return <Tag>-</Tag>;

  let color = 'green';
  let label = statut_sortie;

  if (statut_sortie === 'Retard' && duree_retard) {
    const [hours = 0] = duree_retard.split(' ');
    const minutes = parseFloat(hours) * 60;

    if (minutes <= 30) color = 'orange';
    else if (minutes <= 60) color = 'red';
    else color = 'volcano';

    label = `${statut_sortie} (${duree_retard})`;
  }

  return (
    <Tooltip title={duree_retard || '-'}>
      <Tag color={color} style={{ fontWeight: 600 }}>
        {label}
      </Tag>
    </Tooltip>
  );
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
      dataIndex: 'nom',
      key:'nom',
      render: (text) => renderTextWithTooltip(text),
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
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      align: 'center',
      render: (text) => <Tag icon={<TrademarkOutlined />} color="blue">{text}</Tag>,
    },
    {
      title: 'Sortie prévue',
      dataIndex: 'date_prevue',
      key: 'date_prevue',
      align: 'center',
      render: (text) => renderDateTag(text),
    },
    {
      title: 'Retour prévu',
      dataIndex: 'date_retour',
      key: 'date_retour',
      align: 'center',
      render: (text) => renderDateTag(text),
    },
    {
      title: <Space><FieldTimeOutlined style={{ color:'orange' }} /><Text strong>Statut Sortie</Text></Space>,
      key: 'statut_sortie',
      render: (_, record) => renderStatutSortie(record.statut_sortie, record.duree_retard),
    },
  ];

  return (
    <div className="rapportVehiculeValide">
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id_vehicule}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
        bordered
        size="middle"
      />
    </div>
  );
};

export default RapportVehiculeValide;
