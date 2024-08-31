import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag } from 'antd';
import { ExportOutlined, PrinterOutlined, ApartmentOutlined, PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import { getSuiviOne } from '../../../services/suiviService';
import moment from 'moment';

const { Search } = Input;

const ListeControler = ({idControle}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getSuiviOne(idControle);
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
  }, [idControle]);

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    // Logic to export data to PDF
    message.success('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        Export to Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Export to PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { 
      title: '#', 
      dataIndex: 'id_suivi_controle', 
      key: 'id_suivi_controle', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    { 
      title: 'Status', 
      dataIndex: 'nom_type_statut', 
      key: 'nom_type_statut',
      render: text => (
        <Space>
          <Tag color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Commentaire', 
      dataIndex: 'commentaires',
      key: 'commentaires',
      render: text => (
        <Space>
          <Tag color='blue'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Date', 
      dataIndex: 'date_suivi', 
      key: 'date_suivi',
      render: text => (
        <Tag color='magenta'>
            {moment(text).format('DD-MM-yyyy')}
        </Tag>
      ),
    },
    { 
      title: 'Effectué par', 
      dataIndex: 'nom', 
      key: 'nom',
      render: text => (
        <Tag color='purple'>{text}</Tag>
      ),
    },
/*     {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
           <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              aria-label="View department details"
            />
          </Tooltip>
           <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record)}
              aria-label="Edit department"
            />
          </Tooltip> 
           <Tooltip title="Delete">
            <Popconfirm
              title="Etes-vous sûr de vouloir supprimer ce département ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Delete department"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    }, */
  ];

  const filteredData = data.filter(item =>
    item.commentaires?.toLowerCase().includes(searchValue.toLowerCase())  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ApartmentOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Liste des controles</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-rows-right">
{/*               <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                controler
              </Button> */}
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            rowKey="key"
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default ListeControler;
