import React, { useEffect, useState } from 'react';
import { Table, Button, Input, notification, Tag, Tabs } from 'antd';
import { ProfileOutlined, UserOutlined, PrinterOutlined } from '@ant-design/icons';
import { getBesoin } from '../../services/besoinsService';
import BesoinInactif from './BesoinInactif';

const { Search } = Input;

const Besoins = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const scroll = { x: 400 };

  const fetchData = async () => {
    try {
      const response = await getBesoin();
      setData(response.data);
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

  // Regrouper les données par id_projet
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.id_projet]) {
      acc[item.id_projet] = {
        id_projet: item.id_projet,
        nom_projet: item.nom_projet,
        items: []
      };
    }
    acc[item.id_projet].items.push(item);
    return acc;
  }, {});

  // Convertir les données regroupées en tableau
  const groupedDataArray = Object.values(groupedData);

  // Filtrage des données
  const filteredData = groupedDataArray.filter(item =>
    item.nom_projet?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.items.some(subItem =>
      subItem.nom_article?.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const nestedColumns = [
    {
      title: 'Client',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <Tag icon={<UserOutlined />} color="green">{text || 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Article',
      dataIndex: 'nom_article',
      key: 'nom_article',
      render: (text) => (
        <Tag color="blue">{text || 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Quantité',
      dataIndex: 'quantite',
      key: 'quantite',
      render: (text) => (
        <Tag color='orange'>{text || 'Aucune'}</Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tag color="magenta">{text || 'Aucune'}</Tag>
      ),
    }
  ];

  const mainColumns = [
    {
      title: 'Projet',
      dataIndex: 'nom_projet',
      key: 'nom_projet',
      render: (text) => <Tag color="blue">{text || 'Sans projet'}</Tag>,
    },
  ];

  return (
    <div className="client">
      <div className="client-wrapper">
        <Tabs defaultActiveKey="0">
          <Tabs.TabPane tab="Liste de besoin sans projet" key="0">
            <BesoinInactif />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Liste des besoins" key="1">
            <div className="client-row">
              <div className="client-row-icon">
                <ProfileOutlined className='client-icon' />
              </div>
              <h2 className="client-h2">Liste des besoins</h2>
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
                <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
                  Print
                </Button>
              </div>
            </div>

            <Table
              columns={mainColumns}
              dataSource={filteredData}
              loading={loading}
              pagination={false}
              rowKey="id_projet"
              bordered
              size="middle"
              scroll={scroll}
              expandable={{
                expandedRowRender: record => (
                  <Table
                    columns={nestedColumns}
                    dataSource={record.items}
                    pagination={false}
                    rowKey="nom_article"
                    bordered
                    size="middle"
                    scroll={scroll}
                  />
                ),
                rowExpandable: record => record.items.length > 0,
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Besoins;
