import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Image } from 'antd';
import { ExportOutlined, PrinterOutlined,EditOutlined, PlusCircleOutlined,DeleteOutlined} from '@ant-design/icons';
import { getInspectionOne } from '../../../services/batimentService';
import config from '../../../config';

const { Search } = Input;

const InstructionOne = ({idBatiment}) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [idCorps, setIdCorps] = useState('');
  const scroll = { x: 400 };

  const handleEdit = (record) => {
    message.info(`Modifier corps metier: ${record}`);
    setIdCorps(record)
    setIsModalVisible(true);

  };

  const handleDelete = async (id) => {
    try {
/*       await deletePutDepartement(id); */
      setData(data.filter((item) => item.id_corps_metier !== id));
      message.success('Corps metier a ete supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

     const fetchData = async () => {
      try {
        const { data } = await getInspectionOne(idBatiment);
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
      title: 'Batiment', 
      dataIndex: 'nom_batiment', 
      key: 'nom_batiment',
      render: text => (
        <Space>
          <Tag color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
        title: 'Commentaire', 
        dataIndex: 'commentaire', 
        key: 'commentaire',
        render: text => (
          <Space>
            <Tag color='cyan'>{text}</Tag>
          </Space>
        ),
      },
      { 
        title: 'Instruction', 
        dataIndex: 'id_cat_instruction', 
        key: 'id_cat_instruction',
        render: text => (
          <Space>
            <Tag color='cyan'>{text}</Tag>
          </Space>
        ),
      },
      {
        title: 'Image',
        dataIndex: 'img',
        key: 'img',
        render: (text, record) => { // Ajout du log pour debug
          return (
            <div className="userList">
              <Image
                className="userImg"
                src={`${DOMAIN}/${record.img}`} // Utilisation de l'URL générée
                alt="Inspection Image"
                fallback="/path-to-default-image.png" // Image par défaut si le chemin est invalide
                width={50} // Ajustez la taille selon vos besoins
              />
            </div>
          );
        },
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
              onClick={() => handleEdit(record.id_corps_metier)}
              aria-label="Edit department"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Etes-vous sûr de vouloir supprimer ce département ?"
              onConfirm={() => handleDelete(record.id_corps_metier)}
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
    item.commentaire?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
                📝
            </div>
            <h2 className="client-h2">Instruction</h2>
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
                icon={<PlusCircleOutlined />}
                onClick={handleAddClient}
              >
                corps metier
              </Button> */}
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
      </Modal>
    </>
  );
};

export default InstructionOne;