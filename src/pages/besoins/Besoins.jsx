import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Dropdown, Menu, notification, Popconfirm, Space, Tooltip, Tag, Collapse } from 'antd';
import { ExportOutlined, ProfileOutlined, UserOutlined, PlusOutlined, PrinterOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import config from '../../config';
import { getBesoin } from '../../services/besoinsService';

const { Search } = Input;
const { Panel } = Collapse;

const Besoins = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getBesoin();
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

    fetchData();
  }, [DOMAIN]);

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
      title: 'Déscription',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tag color={"magenta"}>{text ?? 'Aucune'}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          {/* Exemple de bouton d'édition, commenté pour l'instant */}
          {/* <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record)}
              type="link"
              aria-label="Edit client"
            />
          </Tooltip> */}
{/*           <Tooltip title="Delete">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce client ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Delete client"
              />
            </Popconfirm>
          </Tooltip> */}
        </Space>
      ),
    },
  ];

  // Colonnes pour la table principale
  const mainColumns = [
    {
      title: 'Projet',
      dataIndex: 'nom_projet',
      key: 'nom_projet',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
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
              <Button
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
              >
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
            expandable={{
              expandedRowRender: record => (
                <Table
                  columns={nestedColumns}
                  dataSource={record.items}
                  pagination={false}
                  rowKey="nom_article"
                  bordered
                  size="middle"
                />
              ),
              rowExpandable: record => record.items.length > 0,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Besoins;
