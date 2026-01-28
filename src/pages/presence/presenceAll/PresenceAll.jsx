import { useEffect, useState, useCallback, useMemo } from 'react';
import { Input, Button, Table, Typography, notification } from 'antd';
import {
  FieldTimeOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { getPresence } from '../../../services/presenceService';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const PresenceAll = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const scroll = { x: 700 };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPresence();
      setData(data || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger la liste des presences.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

const columns = useMemo(
  () => [
    {
      title: '#',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Site',
      dataIndex: 'nom_site',
      key: 'nom_site',
      render: (text) => <Text>{text ?? 'N/A'}</Text>
    },
    {
      title: 'Statut',
      dataIndex: 'statut_jour',
      key: 'statut_jour',
      render: (text) => <Text>{text ?? 'N/A'}</Text>
    },
    {
      title: 'Date',
      dataIndex: 'date_presence',
      key: 'date_presence',
      render: (date) =>
        date
          ? dayjs(date).format('DD-MM-YYYY')
          : <Text type="secondary">—</Text>
    },
    {
      title: 'Heure entrée',
      dataIndex: 'heure_entree',
      key: 'heure_entree',
      render: (time) =>
        time
          ? dayjs(time, 'HH:mm:ss').format('HH:mm')
          : <Text type="secondary">—</Text>
    },
    {
      title: 'Heure sortie',
      dataIndex: 'heure_sortie',
      key: 'heure_sortie',
      render: (time) =>
        time
          ? dayjs(time, 'HH:mm:ss').format('HH:mm')
          : <Text type="secondary">—</Text>
    }
  ],
  []
);

  const filteredData = useMemo(() => {
    if (!searchValue) return data;
    return data.filter(item =>
      item.nom?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchValue]);

  return (
    <>
      <div className="client">
        <div className="client-wrapper">

          <div className="client-row">
            <div className="client-row-icon">
              <FieldTimeOutlined />
            </div>
            <h2 className="client-h2">Liste des présences</h2>
          </div>

          <div className="client-actions">
            <div className="client-row-left">
              <Search
                placeholder="Recherche ..."
                allowClear
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="client-rows-right">
              <Button icon={<PrinterOutlined />}>
                Imprimer
              </Button>
            </div>
          </div>

          {/* TABLE */}
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 15 }}
            rowKey="id_terminal"
            bordered
            size="middle"
            scroll={scroll}
            rowClassName={(_, index) =>
              index % 2 === 0 ? 'odd-row' : 'even-row'
            }
          />
        </div>
      </div>

    </>
  );
};

export default PresenceAll;
