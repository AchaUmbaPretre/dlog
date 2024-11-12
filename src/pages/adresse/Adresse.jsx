import React, { useEffect, useState } from 'react';
import { Table, Modal, Input, message, Menu, notification, Tag } from 'antd';
import { ExportOutlined, BankOutlined } from '@ant-design/icons';
import { getDenomination } from '../../../services/batimentService';

const { Search } = Input;

const Adresse = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);

     const fetchData = async () => {

      try {
        const { data } = await getDenomination();
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

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };


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


  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        <Tag icon={<ExportOutlined />} color="green">Export to Excel</Tag>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <Tag icon={<ExportOutlined />} color="blue">Export to PDF</Tag>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
      render: (text) => (
        <Tag icon={<BankOutlined />} color="green">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Bin',
      dataIndex: 'nom_bin',
      key: 'nom_bin',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    }
  ]

  const filteredData = data.filter(item =>
        item.nom_bin?.toLowerCase().includes(searchValue.toLowerCase())
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
    </>
  );
};

export default Adresse;
