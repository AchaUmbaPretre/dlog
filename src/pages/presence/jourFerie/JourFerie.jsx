import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Modal, Typography, notification } from 'antd';
import {
  FieldTimeOutlined,
  PrinterOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { renderDate } from '../absence/absenceForm/utils/renderStatusAbsence';
import JourFerieForm from './jourFerieForm/JourFerieForm';
import { getJourFerie } from '../../../services/presenceService';

const { Search } = Input;
const { Text } = Typography;

const JourFerie = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 700 };

  // Fetch congés
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getJourFerie();
      setData(data);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ouvrir modal ajout
  const handleAdd = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

const columns = [
  {
    title: '#',
    width: 50,
    align: 'center',
    render: (_, __, index) => index + 1
  },
  {
    title: 'Libellé',
    dataIndex: 'libelle',
    key: 'libelle',
    render: (text) => <Text strong>{text}</Text>
  },
  {
    title: 'Date fériée',
    dataIndex: 'date_ferie',
    key: 'date_ferie',
    align: 'center',
    render: renderDate
  },
  {
    title: 'Payé',
    dataIndex: 'est_paye',
    key: 'est_paye',
    align: 'center',
    render: (value) =>
      value === 1 ? (
        <Text type="success">Oui</Text>
      ) : (
        <Text type="danger">Non</Text>
      )
  }
];

  const filteredData = data?.filter(item =>
    item.libelle?.toLowerCase().includes(searchValue.toLowerCase()) 
  );


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FieldTimeOutlined />
            </div>
            <div className="client-h2">Liste des jours feriés</div>
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
                icon={<PlusCircleOutlined />}
                onClick={handleAdd}
              >
                Ajouter
              </Button>

              <Button icon={<PrinterOutlined />}>
                Print
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 15 }}
            rowKey="id_ferie"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={950}
        centered
      >
        <JourFerieForm closeModal={setIsModalVisible} fetchData={fetchData} />
      </Modal>

    </>
  );
};

export default JourFerie;
