import React, { useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu } from 'antd';
import { ExportOutlined, PrinterOutlined, PlusOutlined,FileDoneOutlined } from '@ant-design/icons';

const { Search } = Input;

const Taches = () => {
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
        Exporter vers Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Exporter au format PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { title: 'Nom', dataIndex: 'nom_tache', key: 'nom_tache' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Statut', dataIndex: 'statut', key: 'statut' },
    { title: 'Frequence', dataIndex: 'id_frequence ', key: 'id_frequence ' },
    { title: 'Point supervision ', dataIndex: '	id_point_supervision', key: 'id_point_supervision' },
    { title: 'Responsable', dataIndex: 'responsable_principal', key: 'responsable_principal' },
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileDoneOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Tâches</h2>
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
                Tâches
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
        title="Ajouter nouvelle tache"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
      </Modal>
    </>
  );
};

export default Taches;
