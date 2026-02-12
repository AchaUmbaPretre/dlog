import { useEffect, useState } from 'react';
import { Table, Button, Input, Tabs, Typography, notification, Modal } from 'antd';
import {
  FileTextOutlined,
  PrinterOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { getHoraireUser } from '../../../services/presenceService';
import { joursSemaine } from './../../../utils/joursSemaine';
import moment from 'moment';
import PresenceHoraireUserForm from './presenceHoraireUserForm/PresenceHoraireUserForm';
import PresenceHoraireGen from './presenceHoraireGen/PresenceHoraireGen';

const { Search } = Input;
const { Text } = Typography;

const PresenceHoraire = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeKey, setActiveKey] = useState(['1', '2']);

  // ✅ Fetch des données
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getHoraireUser();
      setData(res?.data || []);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Gestion du modal
  const handleAddClient = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const handlePrint = () => window.print();

  // ✅ Colonnes du tableau
  const columns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: (<><UserOutlined /> Agent</>),
      key: 'agent',
      render: (_, record) => (
        <Text strong>{`${record.utilisateur_nom} ${record.utilisateur_prenom}`}</Text>
      ),
    },
    ...joursSemaine.map(jour => ({
      title: jour.label,
      key: jour.value,
      render: (_, record) => {
        const jourDetail = record.jours.find(j => j.jour === jour.value);
        if (!jourDetail) return <Text type="secondary">—</Text>;

        const debut = moment(jourDetail.heure_debut, "HH:mm:ss").format("HH:mm");
        const fin = moment(jourDetail.heure_fin, "HH:mm:ss").format("HH:mm");

        return <Text>{`${debut} → ${fin}`}</Text>;
      },
    }))
  ];

  // ✅ Filtre de recherche
  const filteredData = data?.filter(item =>
    `${item.utilisateur_nom} ${item.utilisateur_prenom}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

    const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <>
      <Tabs
        activeKey={activeKey[0]}
        onChange={handleTabChange}
        type="card"
        tabPosition="top"
        renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
      >
        <Tabs.TabPane
          tab={
            <span>
              <FileTextOutlined style={{ color: '#1890ff' }} /> Horaire personnel
            </span>
          }
          key="1"
        >
          <div className="client">
            <div className="client-wrapper">
              <div className="client-row">
                <div className="client-row-icon">
                  <FileTextOutlined className='client-icon' />
                </div>
                <h2 className="client-h2">Horaire des personnels</h2>
              </div>

              <div className="client-actions">
                <div className="client-row-left">
                  <Search 
                    placeholder="Recherche..." 
                    onChange={(e) => setSearchValue(e.target.value)}
                    enterButton
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
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                  >
                    Print
                  </Button>
                </div>
              </div>

              <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={{ pageSize: 10 }}
                rowKey="id_planning"
                bordered
                size="middle"
                scroll={{ x: 1400 }} // Scroll horizontal suffisant pour tous les jours
              />
            </div>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <span>
              <FileTextOutlined style={{ color: '#1890ff' }} /> Horaire du travail
            </span>
          }
          key="2"
        >
        <PresenceHoraireGen
          closeModal={setIsModalVisible} 
          fetchData={fetchData} 
        />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <PresenceHoraireUserForm
          closeModal={setIsModalVisible} 
          fetchData={fetchData} 
        />
      </Modal>
    </>
  );
};

export default PresenceHoraire;
