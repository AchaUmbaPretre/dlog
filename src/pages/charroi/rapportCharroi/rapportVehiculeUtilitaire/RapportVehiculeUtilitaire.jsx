import { Table, Tooltip, Space, Typography, Tag } from 'antd';
import { 
  CarOutlined, ApartmentOutlined, EnvironmentOutlined, FieldTimeOutlined
} from '@ant-design/icons';

const { Text } = Typography;

/**
 * Rend un texte avec tooltip et ellipsis pour colonnes longues
 */
const renderTextWithTooltip = (text, color = 'secondary') => (
  <Tooltip title={text}>
    <div>
      <Text type={color}>{text}</Text>
    </div>
  </Tooltip>
);

/**
 * Rend la durée de retard sous forme de tag
 */
const renderRetardTag = (duree_retard) => {
  if (!duree_retard) return <Tag>-</Tag>;

  let color = 'green';
  const [val] = duree_retard.split(' ');
  const jours = parseFloat(val);

  if (jours <= 0.5) color = 'orange';
  else if (jours <= 1) color = 'red';
  else color = 'volcano';

  return <Tag color={color}>{duree_retard}</Tag>;
};

const RapportVehiculeUtilitaire = ({ utilitaire }) => {
  const columns = [
    { 
      title: '#', 
      key: 'index', 
      render: (_, __, index) => index + 1, 
      width: 50 
    },
    {
      title: <Space><CarOutlined style={{ color: 'green' }} /><Text strong>Type de véhicule</Text></Space>,
      dataIndex:'nom_cat',
      key:'nom_cat',
      render: (text) => renderTextWithTooltip(text),
    },
/*     {
      title: <Space><ApartmentOutlined style={{ color: '#1d39c4' }} /><Text strong>Service</Text></Space>,
      dataIndex: 'nom_service',
      key:'nom_service',
      render: (text) => renderTextWithTooltip(text),
    }, */
    {
      title: <Space><EnvironmentOutlined style={{ color: 'red' }} /><Text strong>Destination</Text></Space>,
      dataIndex: 'nom_destination',
      key:'nom_destination',
      render: (text) => renderTextWithTooltip(text),
    },
    {
      title: <Space><FieldTimeOutlined style={{ color:'orange' }} /><Text strong>Durée Retard</Text></Space>,
      dataIndex: 'duree_retard',
      key: 'duree_retard',
      render: (text) => renderRetardTag(text),
    }
  ];

  return (
    <div className="rapportVehiculeValide">
      <Table
        columns={columns}
        dataSource={utilitaire}
        rowKey={(record, index) => index}
        pagination={false}
        bordered
        size="middle"
      />
    </div>
  );
};

export default RapportVehiculeUtilitaire;
