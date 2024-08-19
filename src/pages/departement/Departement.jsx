import React, { useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu } from 'antd';
import { ExportOutlined, PrinterOutlined, PlusOutlined,TeamOutlined } from '@ant-design/icons';
import './departement.scss';

const { Search } = Input;

const Departement = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    { title: 'Nom', dataIndex: 'nom', key: 'nom' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Telephone', dataIndex: 'telephone', key: 'telephone' },
    { title: 'Adresse', dataIndex: 'adresse', key: 'adresse' },
    { title: 'Pays', dataIndex: 'pays', key: 'pays' },
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <TeamOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Client</h2>
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
                Add Client
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
        title="Ajouter Département"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
      </Modal>
    </>
  );
};

export default Departement;
