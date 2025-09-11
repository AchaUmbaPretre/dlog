import './rapportVehiculeValide.scss';
import { Table, Tag, Tooltip, Space, Typography, Menu } from 'antd';
import { 
  CarOutlined, ApartmentOutlined, UserOutlined, FieldTimeOutlined, 
  EnvironmentOutlined, AppstoreOutlined, TrademarkOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import { useState } from 'react';

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
  
  const jours = Math.floor(minutesTotal / 1440);
  const heures = Math.floor((minutesTotal % 1440) / 60);
  const minutes = minutesTotal % 60;

  let result = '';
  if (jours > 0) result += `${jours} jour${jours > 1 ? 's' : ''} `;
  if (heures > 0) result += `${heures}h `;
  if (minutes > 0) result += `${minutes}m`;
  return result.trim();
};

// 🟢🟠🔴 Statut basé sur date prévue avec retard exact
const renderStatutHoraire = (nom_statut_bs, date_prevue) => {
  if (!nom_statut_bs || !date_prevue) return <Tag>-</Tag>;

  const now = moment();
  const prevue = moment(date_prevue);
  const diffMinutes = now.diff(prevue, 'minutes');

  let color = 'green';
  let label = `🟢 ${nom_statut_bs === 'BS validé' ? 'En attente' : ''}`;

  if (diffMinutes <= 60) {
    color = 'orange';
    label = `🟠 ${nom_statut_bs === 'BS validé' ? 'En attente' : ''} (${diffMinutes} min de retard)`;
  } else if (diffMinutes > 60) {
    color = 'red';
    label = `🔴 ${nom_statut_bs === 'BS validé' ? 'En attente' : ''} (${formatDuration(diffMinutes)} de retard)`;
  }

  return (
    <Tag color={color} style={{ fontWeight: 600 }}>
      {label}
    </Tag>
  );
};

const RapportVehiculeValide = ({ data }) => {
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'Motif': true,
    'Service': true,
    'Chauffeur': true,
    'Destination' : true,
    'Type véhicule' : true,
    'Immatriculation' : true,
    'Marque' : true,
    'Statut' : true,
    'Sortie prévue': true,
    'Retour prévu': true,
    'Durée moyenne' : true,
    'Durée réelle': false,
    'Écart':false
  });

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


  const columns = [
    { title: '#', key: 'index', render: (_, __, index) => index + 1, width: 50 },

    {
      title: <Space><AppstoreOutlined style={{ color: '#1890ff' }} /><Text strong>Motif</Text></Space>,
      dataIndex: 'nom_motif_demande',
      key:'nom_motif_demande',
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
    ...(columnsVisibility['Motif'] ? {} : { className: 'hidden-column' })
    },
    {
      title: <Space><ApartmentOutlined style={{ color: '#1d39c4' }} /><Text strong>Service</Text></Space>,
      dataIndex: 'nom_service',
      key:'nom_service',
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
        ...(columnsVisibility['Service'] ? {} : { className: 'hidden-column' })
    },
    {
      title: <Space><UserOutlined style={{ color:'orange' }} /><Text strong>Chauffeur</Text></Space>,
      key:'chauffeur',
      render: (_, record) => renderTextWithTooltip(`${record.prenom_chauffeur} ${record.nom}`),
      ellipsis: true,
        ...(columnsVisibility['Chauffeur'] ? {} : { className: 'hidden-column' })
    },
    {
      title: <Space><EnvironmentOutlined style={{ color: 'red' }} /><Text strong>Destination</Text></Space>,
      dataIndex: 'nom_destination',
      key:'nom_destination',
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
        ...(columnsVisibility['Destination'] ? {} : { className: 'hidden-column' })
    },
    {
      title: <Space><CarOutlined style={{ color: 'green' }} /><Text strong>Véhicule</Text></Space>,
      dataIndex:'nom_cat',
      key:'nom_cat',
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
        ...(columnsVisibility['Type véhicule'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Immatriculation',
      dataIndex:'immatriculation',
      key:'immatriculation',
      align: 'center',
      render: (text) => <Tag color='magenta'>{text}</Tag>,
        ...(columnsVisibility['Immatriculation'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Marque',
      dataIndex:'nom_marque',
      key: 'nom_marque',
      align: 'center',
      render: (text) => <Tag icon={<TrademarkOutlined />} color="blue">{text}</Tag>,
        ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Sortie prévue',
      dataIndex:'date_prevue',
      key: 'date_prevue',
      align: 'center',
      render: (text) => renderDateTag(text),
        ...(columnsVisibility['Sortie prévue'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Retour prévu',
      dataIndex:'date_retour',
      key:'date_retour',
      align: 'center',
      render: (text) => renderDateTag(text),
        ...(columnsVisibility['Retour prévu'] ? {} : { className: 'hidden-column' })
    },
    {
      title: <Space><FieldTimeOutlined style={{ color:'orange' }} /><Text strong>Statut</Text></Space>,
      key: 'statut_horaire',
      render: (_, record) => renderStatutHoraire(record.nom_statut_bs, record.date_prevue),
        ...(columnsVisibility['Statut'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Durée réelle',
      dataIndex: 'duree_reelle_min',
      key: 'duree_reelle_min',
      align: 'center',
      render: (val) => <Tag color="geekblue">{formatDuration(val)}</Tag>,
        ...(columnsVisibility['Durée réelle'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Durée moyenne',
      dataIndex: 'duree_moyenne_min',
      key: 'duree_moyenne_min',
      align: 'center',
      render: (val) => <Tag color="purple">{formatDuration(val)}</Tag>,
        ...(columnsVisibility['Durée moyenne'] ? {} : { className: 'hidden-column' })
    },
    {
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
        ...(columnsVisibility['Écart'] ? {} : { className: 'hidden-column' })
    }
  ];

  return (
    <div className="rapportVehiculeValide">

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record, index) => `${record.immatriculation}-${index}`}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
        bordered
        size="middle"
      />
    </div>
  );
};

export default RapportVehiculeValide;
