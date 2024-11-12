import React, { useEffect, useState } from 'react';
import { Table, Input, message, notification, Tag } from 'antd';
import { BankOutlined } from '@ant-design/icons';
import { getAdresse } from '../../services/batimentService';

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

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
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
        item.adresse?.toLowerCase().includes(searchValue.toLowerCase())
   );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
            🏢
            </div>
            <h2 className="client-h2">Liste des adresses</h2>
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
