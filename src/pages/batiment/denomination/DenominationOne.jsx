import React, { useEffect, useState } from 'react';
import { Table, Modal, Input, message, Button, notification, Popconfirm, Space, Tooltip, Tag } from 'antd';
import { BankOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getDenominationOne, putDenominationDelete } from '../../../services/batimentService';
import DenominationForm from './denominationForm/DenominationForm';

const { Search } = Input;

const DenominationOne = ({idBatiment}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [idDenom, setIdDenom] = useState([]);

     const fetchData = async () => {

      try {
        const { data } = await getDenominationOne(idBatiment);
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
  }, [idBatiment]);
;

  const closeAllModals = () => {
    setModalType(null);
  };
  const openModal = (type, idDenom = '') => {
    closeAllModals();
    setModalType(type);
    setIdDenom(idDenom);
  };

  const handleEdit = (idDenom) => openModal('Edit', idDenom)

  const handleDelete = async (id) => {
    try {
      await putDenominationDelete(id)
      setData(data.filter((item) => item.id_denomination_bat !== id));
      message.success('denomination deleted successfully');
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
        <Tag icon={<BankOutlined />} color="green">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Dénomination',
      dataIndex: 'nom_denomination_bat',
      key: 'nom_denomination_bat',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Modifier">
              <Button
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleEdit(record.id_denomination_bat)}
                aria-label="Edit tache"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer ce client?"
                onConfirm={() => handleDelete(record.id_denomination_bat)}
                okText="Oui"
                cancelText="Non"
              >
                <Button
                  icon={<DeleteOutlined />}
                  style={{ color: 'red' }}
                  aria-label="Delete client"
                />
              </Popconfirm>
            </Tooltip>
        </Space>
      ),
    },
  ]

  const filteredData = data.filter(item =>
    item.nom_denomination_bat?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_batiment?.toLowerCase().includes(searchValue.toLowerCase())
   );


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
            🏢
            </div>
            <h2 className="client-h2">Liste des dénominations</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search 
                placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'Edit'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <DenominationForm idBatiment={''} idDenomination_bat={idDenom}/>
    </Modal>
    </>
  );
};

export default DenominationOne;
