import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag } from 'antd';
import { ExportOutlined, PrinterOutlined,BankOutlined, ApartmentOutlined,EditOutlined, PlusCircleOutlined,DeleteOutlined} from '@ant-design/icons';
import BureauForm from './bureauForm/BureauForm';
import { getBureau, getBureauOne } from '../../../services/batimentService';

const { Search } = Input;

const Bureaux = ({idBatiment}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [idDepartement, setIdDapartement] = useState('');
  const scroll = { x: 400 };

  const handleEdit = (record) => {
    message.info(`Modifier departement: ${record.nom}`);
    setIdDapartement(record)
    setIsModalVisible(true);

  };

  const handleDelete = async (id) => {
    try {
/*       await deletePutDepartement(id); */
      setData(data.filter((item) => item.id_departement !== id));
      message.success('Departement supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

    const fetchData = async () => {
      try {
        const { data } = await getBureauOne(idBatiment);
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

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      dataIndex: 'id', 
      key: 'id', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    { 
      title: 'Nom', 
      dataIndex: 'nom', 
      key: 'nom',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Longueur', 
      dataIndex: 'longueur',
      key: 'longueur',
      render: text => (
        <Space>
          <Tag color='blue'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
    },
    { 
        title: 'Largeur', 
        dataIndex: 'largeur',
        key: 'largeur',
        render: text => (
          <Space>
            <Tag color='blue'>{text ?? 'Aucun'}</Tag>
          </Space>
        ),
      },
      { 
        title: 'Hauteur', 
        dataIndex: 'hauteur',
        key: 'hauteur',
        render: text => (
          <Space>
            <Tag color='orange'>{text ?? 'Aucun'}</Tag>
          </Space>
        ),
      },
      { 
        title: 'Nbre poste', 
        dataIndex: 'nombre_postes',
        key: 'nombre_postes',
        render: text => (
          <Space>
            <Tag color='orange'>{text ?? 'Aucun'}</Tag>
          </Space>
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
              onClick={() => handleEdit(record.id_departement)}
              aria-label="Edit department"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Etes-vous sûr de vouloir supprimer ce département ?"
              onConfirm={() => handleDelete(record.id_departement)}
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
    },
  ];

  const filteredData = data.filter(item =>
    item.nom_departement?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.code?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <BankOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Bureau</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAddClient}
              >
                département
              </Button>
              <Dropdown overlay={menu} trigger={['click']} className='client-export'>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                className='client-export'
              >
                Print
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            rowKey="key"
            bordered
            size="middle"
            scroll={scroll}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        <BureauForm id_departement={idDepartement} closeModal={() => setIsModalVisible(false)} fetchData={fetchData}/>
      </Modal>
    </>
  );
};

export default Bureaux;
