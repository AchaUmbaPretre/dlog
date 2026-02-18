import { useEffect, useState } from 'react';
import { CarOutlined, TruckOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Table, Tooltip, Typography, Input, Space, notification, Button, Popconfirm } from 'antd';
import { getVehiculeOccupe, rendreVehiculeDispo } from '../../../../services/charroiService';

const { Search } = Input;
const { Text } = Typography;

const DemandevehiculeOccupe = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });
  const [searchValue, setSearchValue] = useState('');
  const scroll = { x: 'max-content' };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getVehiculeOccupe();
      setData(response.data);
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des véhicules occupés.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // refresh auto
    return () => clearInterval(interval);
  }, []);

  /* ======================================================
     🔹 RENDRE UN VÉHICULE DISPONIBLE
  ====================================================== */
  const handleRendreDisponible = async (idVehicule) => {
    try {
      setLoading(true);
      await rendreVehiculeDispo(idVehicule);
      notification.success({ message: 'Véhicule rendu disponible avec succès' });
      fetchData(); // refresh tableau
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Erreur', description: 'Impossible de rendre le véhicule disponible' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: '4%',
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: 'red' }} />
          <Text strong>Immatriculation</Text>
        </Space>
      ),
      dataIndex: 'immatriculation',
      key: 'immatriculation',
      ellipsis: { showTitle: false },
      render: (text) => <Tooltip title={text}><Text>{text}</Text></Tooltip>,
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: 'blue' }} />
          <Text strong>Marque</Text>
        </Space>
      ),
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      ellipsis: { showTitle: false },
      render: (text) => <Tooltip title={text}><Text>{text}</Text></Tooltip>,
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: '#2db7f5' }} />
          <Text strong>Modèle</Text>
        </Space>
      ),
      dataIndex: 'modele',
      key: 'modele',
      ellipsis: { showTitle: false },
      render: (text) => <Tooltip title={text}><Text>{text}</Text></Tooltip>,
    },
    {
      title: 'Catégorie',
      dataIndex: 'nom_cat',
      key: 'nom_cat',
      ellipsis: { showTitle: false },
    },
    {
      title: 'Chauffeur',
      dataIndex: 'nom_chauffeur',
      key: 'nom_chauffeur',
      ellipsis: { showTitle: false },
    },
    {
      title: 'Date affectation',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Popconfirm
          title={`Rendre le véhicule "${record.immatriculation}" disponible ?`}
          onConfirm={() => handleRendreDisponible(record.id_vehicule)}
          okText="Oui"
          cancelText="Non"
        >
          <Button type="primary" icon={<CheckCircleOutlined />} size="small">
            Disponible
          </Button>
        </Popconfirm>
      ),
    },
  ];

  /* ======================================================
     🔹 FILTRE
  ====================================================== */
  const filteredData = data.filter((item) =>
    item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="client">
      <div className="client-wrapper">
        <div className="client-row">
          <div className="client-row-icon">
            <TruckOutlined className="client-icon" style={{ color: 'red' }} />
          </div>
          <h2 className="client-h2">Véhicules occupés</h2>
        </div>
        <div className="client-actions">
          <Search
            placeholder="Recherche..."
            enterButton
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
          rowKey="id_vehicule"
          rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          bordered
          size="small"
          scroll={scroll}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DemandevehiculeOccupe;
