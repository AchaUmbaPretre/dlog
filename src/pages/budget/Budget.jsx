import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popover, Popconfirm, Tag } from 'antd';
import { ExportOutlined,DollarOutlined, PrinterOutlined,ApartmentOutlined,EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import config from '../../config';
import BudgetForm from './budgetForm/BudgetForm';

const { Search } = Input;

const Budget = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEdit = (record) => {
    message.info(`Editing client: ${record.nom}`);
  };

  const handleDelete = async (id) => {
    try {
      // Uncomment when delete function is available
      // await deleteClient(id);
      setData(data.filter((item) => item.id !== id));
      message.success('Client deleted successfully');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

  const handleViewDetails = (record) => {
    message.info(`Viewing details of client: ${record.nom}`);
  };


/*   useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getDepartement();
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
  }, [DOMAIN]); */

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
      title: 'Items', 
      dataIndex: 'items', 
      key: 'items',
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Qté demandée', 
      dataIndex: 'qte_demande', 
      key: 'qte_demande',
      render: text => (
        <Tag color='geekblue'>{text}</Tag>
      ),
    },
    { 
      title: 'Qté validée', 
      dataIndex: 'qt_valide',
      key: 'qt_valide',
      render: text => (
        <Space>
          <Tag color='blue'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Offres', 
      dataIndex: 'offres', 
      key: 'offres',
      render: text => (
        <Tag color='purple'>{text}</Tag>
      ),
    },
    { 
        title: 'Fourniseurs', 
        dataIndex: 'fourniseurs', 
        key: 'fourniseurs',
        render: text => (
          <Tag color='purple'>{text}</Tag>
        ),
      },
    {
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
              title="Are you sure you want to delete this department?"
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
    },
  ];


  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <DollarOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Budget</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Search clients..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Budget
              </Button>
              <Dropdown overlay={menu} trigger={['click']}>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            rowKey="key"
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <BudgetForm/>
      </Modal>
    </>
  );
};

export default Budget;
