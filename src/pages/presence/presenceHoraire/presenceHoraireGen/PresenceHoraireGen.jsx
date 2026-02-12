import { useEffect, useState } from 'react';
import { Table, Button, Input, Typography, notification, Modal } from 'antd';
import {
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { getHoraire } from '../../../../services/presenceService';
import PresenceHoraireForm from '../presenceHoraireForm/PresenceHoraireForm';

const { Search } = Input;
const { Text } = Typography;

const joursOrdre = [
  'LUNDI',
  'MARDI',
  'MERCREDI',
  'JEUDI',
  'VENDREDI',
  'SAMEDI',
  'DIMANCHE'
];

const PresenceHoraireGen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getHoraire();
      setData(res?.data || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClient = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  // 🔎 Filtrage recherche
  const filteredData = data.filter(item =>
    item.nom?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // ✅ Colonnes dynamiques
  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Nom Horaire',
      dataIndex: 'nom',
      key: 'nom',
      width: '180px',
      render: text => <Text strong>{text}</Text>,
    },
    ...joursOrdre.map(jour => ({
      title: jour,
      key: jour,
      align: 'center',
      render: (_, record) => {
        const detail = record.details?.find(d => d.jour_semaine === jour);

        if (!detail) return <Text type="secondary">—</Text>;

        const debut = moment(detail.heure_debut, "HH:mm:ss").format("HH:mm");
        const fin = moment(detail.heure_fin, "HH:mm:ss").format("HH:mm");

        return (
          <div>
            <div>{`${debut} → ${fin}`}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Tolérance: {detail.tolerance_retard} min
            </Text>
          </div>
        );
      }
    })),
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Horaire général</h2>
          </div>

          <div className="client-actions">
            <div className="client-row-left">
              <Search
                placeholder="Recherche par nom..."
                onChange={(e) => setSearchValue(e.target.value)}
                enterButton
                allowClear
              />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="id_horaire"
            bordered
            size="middle"
            scroll={{ x: 1500 }}
          />
        </div>
      </div>

      <Modal
        title="Ajouter un horaire"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        centered
        destroyOnClose
      >
        <PresenceHoraireForm
          closeModal={setIsModalVisible}
          fetchData={fetchData}
        />
      </Modal>
    </>
  );
};

export default PresenceHoraireGen;
