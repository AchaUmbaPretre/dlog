import { useEffect, useState, useCallback } from 'react';
import { Table, Typography, Tag, Tooltip } from 'antd';
import { CalendarOutlined } from "@ant-design/icons";
import moment from 'moment';
import { getCarburantLimitThree } from '../../../../../services/carburantService';

const { Text } = Typography;

const CarburantTableDetailThree = ({ setCarburantId, loading, vehiculeDataId }) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [data, setData] = useState([]);
  const [vehiculeInfo, setVehiculeInfo] = useState({ marque: '', modele: '', immatriculation: '' });

  const scroll = { x: 'max-content' };

  // Fetch data
  const fetchCarburantData = useCallback(async () => {
    if (!vehiculeDataId) return;

    try {
      const response = await getCarburantLimitThree(vehiculeDataId);
      const carburantData = response?.data?.data || [];
      setData(carburantData);
      if (carburantData.length > 0) {
        setVehiculeInfo({
          marque: carburantData[0].nom_marque || '',
          modele: carburantData[0].nom_modele || '',
          immatriculation: carburantData[0].immatriculation || '',
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des carburants :', error);
    }
  }, [vehiculeDataId]);

  useEffect(() => {
    fetchCarburantData();
  }, [fetchCarburantData]);

  const handleRowClick = (id) => setCarburantId?.(id);

  const getColumns = () => [
    {
      title: "#",
      key: "index",
      width: 40,
      align: "center",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Marque",
      dataIndex: "nom_marque",
      key: "nom_marque",
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title="Récupérer les données de cet enregistrement">
          <Tag 
            color="success"
            onClick={() => handleRowClick(record.id_carburant)}
            style={{ cursor: "pointer" }}
          >
            {text}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Immatri.",
      dataIndex: "immatriculation",
      key: "immatriculation",
      ellipsis: true,
      render: (text, record) => (
        <Tag 
          color="blue"
          style={{ cursor: "pointer" }}
          onClick={() => handleRowClick(record.id_carburant)}
        >
          {text || 'N/A'}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date_operation",
      key: "date_operation",
      ellipsis: true,
      sorter: (a, b) => moment(a.date_operation).unix() - moment(b.date_operation).unix(),
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
      render: (text) => (
        <Tag icon={<CalendarOutlined />} color="red">
          {text ? moment(text).format("DD-MM-YYYY") : "Aucune"}
        </Tag>
      ),
    },
    {
      title: "Dist. (km)",
      dataIndex: "distance",
      key: "distance",
      align: "right",
      ellipsis: true,
      sorter: (a, b) => (a.distance || 0) - (b.distance || 0),
      sortDirections: ['descend', 'ascend'],
      render: (text) => <Tag>{text} Km</Tag>,
    },
    {
      title: "Compteur KM",
      dataIndex: "compteur_km",
      key: "compteur_km",
      align: "right",
      ellipsis: true,
      sorter: (a, b) => (a.compteur_km || 0) - (b.compteur_km || 0),
      sortDirections: ['descend', 'ascend'],
      render: (text) => <Tag>{text} Km</Tag>,
    },
    {
      title: "Qté",
      dataIndex: "quantite_litres",
      key: "quantite_litres",
      align: "right",
      ellipsis: true,
      sorter: (a, b) => (a.quantite_litres || 0) - (b.quantite_litres || 0),
      sortDirections: ['descend', 'ascend'],
      render: (text) => <Text mark>{text} L</Text>,
    },
    {
      title: "Cons.",
      dataIndex: "consommation",
      key: "consommation",
      align: "right",
      render: (text) => <Text mark>{text} L</Text>,
    },
    {
      title: "Crée par",
      dataIndex: "createur",
      key: "createur",
      align: "right",
      render: (text) => <Tag>{text || 'N/A'}</Tag>,
    },
  ];

  return (
    <div className="carburantTableDetail">
      <div className="carburant_title_rows">
        <h1 className="carburant_h1">
          3 derniers enregistrements de {vehiculeInfo.marque} {vehiculeInfo.modele} {vehiculeInfo.immatriculation}
        </h1>
      </div>

      <div className="carburant_table">
        <Table
          columns={getColumns()}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={setPagination}
          rowKey="id_carburant"
          bordered
          size="small"
          scroll={scroll}
          rowClassName={(_, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
        />
      </div>
    </div>
  );
};

export default CarburantTableDetailThree;
