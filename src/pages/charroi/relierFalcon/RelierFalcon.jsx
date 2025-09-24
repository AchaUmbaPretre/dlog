import { useEffect, useState } from 'react';
import { getVehiculeOne, putRelierVehiculeFalcon } from '../../../services/charroiService';
import { getFalcon } from '../../../services/rapportService';
import { getOdometer } from '../../../services/geocodeService';
import { Table, Tag, Button, Typography, message, Card, Space, Input, Spin } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import moment from 'moment';
import './relierFalcon.scss';

const { Text } = Typography;

const RelierFalcon = ({ idVehicule, closeModal, fetchData }) => {
  const [vehicule, setVehicule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [falcon, setFalcon] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [searchValue, setSearchValue] = useState('');

  // ✅ Sélection d'un seul véhicule
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const rowSelection = {
    type: 'radio', // selection d’un seul
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedRow(rows[0] || null);
    },
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => ((pagination.current - 1) * pagination.pageSize) + index + 1,
      width: "4%",
    },
    {
      title: 'Matricule',
      dataIndex: 'name',
      render: text => (
        <Space>
          <CarOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Date & Heure',
      dataIndex: 'time',
      render: text => <Text>{moment(text, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")}</Text>,
      sorter: (a, b) =>
        moment(a.time, "DD-MM-YYYY HH:mm:ss").unix() - moment(b.time, "DD-MM-YYYY HH:mm:ss").unix(),
    },
    {
      title: 'Km Total',
      dataIndex: 'sensors',
      render: sensors => {
        const km = getOdometer(sensors);
        return !km || isNaN(km) ? <Tag>N/A</Tag> : <Text>{Number(km).toLocaleString('fr-FR')} km</Text>;
      },
    },
  ];

  // 🔹 Fetch Falcon data
  useEffect(() => {
    const fetchFalcon = async () => {
      try {
        const { data } = await getFalcon();
        setFalcon(data[0].items);
      } catch (error) {
        console.error(error);
        message.error('Erreur lors du chargement des données Falcon');
      }
    };
    fetchFalcon();
  }, []);

  // 🔹 Fetch véhicule info
  useEffect(() => {
    if (!idVehicule) return;
    const fetchVehicule = async () => {
      setLoading(true);
      try {
        const { data } = await getVehiculeOne(idVehicule);
        setVehicule(data.data[0]);
      } catch (error) {
        message.error('Erreur de chargement du véhicule');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicule();
  }, [idVehicule]);

  // 🔹 Submit
  const handleRelier = async () => {
    if (!selectedRow) {
      message.warning("Veuillez sélectionner un véhicule.");
      return;
    }

    try {
      const { id: id_capteur, name: name_capteur } = selectedRow;
      await putRelierVehiculeFalcon(idVehicule, { id_capteur, name_capteur });
      message.success('Véhicule relié avec succès !');
      closeModal();
      fetchData();
    } catch (error) {
      console.error(error);
      message.error('Une erreur est survenue lors du reliement');
    }
  };

  return (
    <Card title="Relier un véhicule Falcon" className="relierFalconCard" bordered>
      {loading ? (
        <Spin tip="Chargement..." />
      ) : (
        <>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Card type="inner" size="small" title="Détails du véhicule">
              <Space size="large">
                <Text><b>Immatriculation:</b> {vehicule?.immatriculation}</Text>
                <Text><b>Type:</b> {vehicule?.nom_cat}</Text>
                <Text><b>Marque:</b> {vehicule?.nom_marque}</Text>
                <Text><b>Modèle:</b> {vehicule?.modele}</Text>
              </Space>
            </Card>

            <Input.Search
              placeholder="Rechercher par matricule..."
              allowClear
              onChange={e => setSearchValue(e.target.value)}
              style={{ width: 300 }}
            />

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={falcon.filter(item => item.name?.toLowerCase().includes(searchValue.toLowerCase()))}
              rowKey="id"
              bordered
              size="middle"
              pagination={pagination}
              onChange={setPagination}
              rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
            />

            <Button type="primary" onClick={handleRelier} disabled={!selectedRow}>
              Relier le véhicule sélectionné
            </Button>
          </Space>
        </>
      )}
    </Card>
  );
};

export default RelierFalcon;
