import React, { useEffect, useState } from 'react';
import { Table, Button, Input, notification, Tag, Modal, Select } from 'antd';
import { ProfileOutlined, UserOutlined, PlusCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { getBesoinInactif } from '../../services/besoinsService';
import ProjetBesoin from '../projet/projetBesoin/ProjetBesoin';
import { getProjet, putProjetBesoin } from '../../services/projetService';

const { Search } = Input;

const BesoinInactif = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [newProjet, setNewProjet] = useState(null);
  const [pData, setPData] = useState([]);
  const scroll = { x: 400 };

  const closeAllModals = () => {
    setModalType(null);
  };

  const handleChangePriority = (value, record) => {
    setNewProjet(value);
    setEditingRow(null);
    handleUpdateProjet(record.id_besoin, value);
  };
  

  const handleDoubleClick = (record) => {
    setEditingRow(record.id_besoin);
    setNewProjet(record.id_projet);
  };

  const handleUpdateProjet = async (idProjet, id_besoin) => {
    try {
      await putProjetBesoin(idProjet, id_besoin);

      notification.success({
        message: 'Mise à jour réussie',
        description: `Le projet a été mis à jour avec succès.`,
      });

      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: `Une erreur est survenue lors de la mise à jour.`,
        duration: 3,
      });
    }
  };

  const openModal = (type) => {
    closeAllModals();
    setModalType(type);
  };

  const handleAddBesoin = () => {
    openModal('AddBesoin');
  };

  const fetchData = async () => {
    try {
      const [besoinData, projetData] = await Promise.all([
        getBesoinInactif(),
        getProjet()
      ]);

      setData(besoinData.data);
      setPData(projetData.data);
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

  // Filtrage des données
  const filteredData = data.filter(item =>
    item.nom_article.toLowerCase().includes(searchValue.toLowerCase())
  );

  const nestedColumns = [
    {
      title: 'Client',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <Tag icon={<UserOutlined />} color="green">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Article',
      dataIndex: 'nom_article',
      key: 'nom_article',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Quantité',
      dataIndex: 'quantite',
      key: 'quantite',
      render: (text) => (
        <Tag color='orange'>{text ?? 'Aucune'}</Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tag color="magenta">{text ?? 'Aucune'}</Tag>
      ),
    },
    {
        title: 'Affecter à un projet',
        dataIndex: 'id_projet',
        key: 'id_projet',
        render: (text, record) => {
          if (editingRow === record.id_besoin) {
            return (
              <Select
                value={newProjet}
                showSearch
                onChange={(value) => handleChangePriority(value, record)} // Passe l'id_besoin et id_projet
                onBlur={() => setEditingRow(null)}
                options={pData.map((item) => ({
                  value: item.id_projet,
                  label: item.nom_projet,
                }))}
                style={{ width: 120 }}
              />
            );
          }
          return (
            <Tag onDoubleClick={() => handleDoubleClick(record)}>
              {record.nom_projet ?? 'Non assigné'}
            </Tag>
          );
        },
      }
      
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ProfileOutlined className="client-icon" />
            </div>
            <h2 className="client-h2">Liste des besoins sans projet</h2>
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
                onClick={handleAddBesoin}
              >
                Besoin
              </Button>
              <Button
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
              >
                Print
              </Button>
            </div>
          </div>
          <div className="client-table-container">
            <Table
              columns={nestedColumns}
              dataSource={filteredData}
              loading={loading}
              pagination={false}
              rowKey="id_besoin"
              bordered
              size="middle"
              scroll={scroll}
            />
          </div>
        </div>
      </div>
      <Modal
        title=""
        visible={modalType === 'AddBesoin'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <ProjetBesoin idProjet={''} fetchData={fetchData} closeModal={closeAllModals} />
      </Modal>
    </>
  );
};

export default BesoinInactif;
