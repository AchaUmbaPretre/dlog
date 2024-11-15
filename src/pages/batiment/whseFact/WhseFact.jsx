import React, { useEffect, useState } from 'react';
import { Table, Input, message, notification, Tag } from 'antd';
import { FileTextOutlined,ApartmentOutlined,ShareAltOutlined,LockOutlined,DollarOutlined,BankOutlined } from '@ant-design/icons';
import { getWHSEFACT } from '../../../services/batimentService';

const { Search } = Input;

const WhseFact = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const scroll = { x: 400 };

     const fetchData = async () => {

      try {
        const { data } = await getWHSEFACT();
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
      title: 'Template',
      dataIndex: 'desc_template',
      key: 'desc_template',
      render: (text) => {
        return (
          <Tag color= 'blue'>
            {text ?? 'Aucun'}
          </Tag>
        );
      },
    },
    {
      title: 'Type occu',
      dataIndex: 'nom_type_d_occupation',
      key: 'nom_type_d_occupation',
      render: (text) => {
        let color;
        let icon;
        switch (text) {
          case 'Dedié':
            color = 'green'; // Couleur pour "Dedié"
            icon = <ApartmentOutlined />; // Icône pour "Dedié"
            break;
          case 'Partagé':
            color = 'orange'; // Couleur pour "Partagé"
            icon = <ShareAltOutlined />; // Icône pour "Partagé"
            break;
          case 'Réservé':
            color = 'red';
            icon = <LockOutlined />;
            break;
          default:
            color = 'blue';
            icon = <ApartmentOutlined />; 
        }
        return (
          <Tag icon={icon} color={color}>{text ?? 'Aucun'}</Tag>
        );
      }    
    }, 
    {
      title: 'Batiment',
      dataIndex: 'nom_batiment',
      key: 'nom_batiment',
      render: (text) => {
        const color = text ? 'green' : 'volcano';
        return (
          <Tag icon={<BankOutlined />} color={color}>
            {text ?? 'Aucun'}
          </Tag>
        );
      },
    },
    {
      title: 'Warehouse fact.',
      dataIndex: 'nom_whse_fact',
      key: 'nom_whse_fact',
      sorter: (a, b) => a.nom_whse_fact - b.nom_whse_fact,
      sortDirections: ['descend', 'ascend'],
      render: (text) => {
        const color = text ? 'blue' : 'red';
        return (
          <Tag color={color}>
            {text ?? 'Aucun'}
          </Tag>
        );
      },
    },
  ];

  const filteredData = data.filter(item =>
    item.nom_niveau?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_whse_fact?.toLowerCase().includes(searchValue.toLowerCase())
   );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste des WhseFact</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." 
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

export default WhseFact;
