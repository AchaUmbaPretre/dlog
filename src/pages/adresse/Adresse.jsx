import React, { useEffect, useState } from 'react';
import { Table, Input, message, notification, Tag, Button, Modal } from 'antd';
import { BankOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getAdresse } from '../../services/batimentService';
import AdresseForm from './adresseForm/AdresseForm';

const { Search } = Input;

const Adresse = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);

      const fetchData = async () => {

      try {
        const { data } = await getAdresse();
        setData(data);
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
;

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idBin = '') => {
    closeAllModals();
    setModalType(type);
  };

  const handleAddBin = (idBin) => {
    openModal('Add', idBin);
  }


  const handleDelete = async (id) => {
    try {
      setData(data.filter((item) => item.id_client !== id));
      message.success('Client deleted successfully');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
        title: 'Batiment',
        dataIndex: 'nom_batiment',
        key: 'nom_batiment',
        render: (text) => (
          <Tag color="blue" icon={<BankOutlined />}>{text ?? 'Aucun'}</Tag>
        ),
      },
    {
        title: 'Bin',
        dataIndex: 'nom',
        key: 'nom',
        render: (text) => (
          <Tag color="blue">{text ?? 'Aucun'}</Tag>
        ),
      },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
      render: (text) => (
        <Tag icon={<BankOutlined />} color="green">{text ?? 'Aucun'}</Tag>
      ),
    }
  ]

  const filteredData = data.filter(item =>
        item.adresse?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom_batiment?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom?.toLowerCase().includes(searchValue.toLowerCase())
   );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
            🏢
            </div>
            <h2 className="client-h2">Liste d'adresses</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search 
                placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAddBin}
              >
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 15 }}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>

        <Modal
          title=""
          visible={modalType === 'Add'}
          onCancel={closeAllModals}
          footer={null}
          width={700}
          centered
        >
          <AdresseForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

      </div>
    </>
  );
};

export default Adresse;
