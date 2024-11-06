import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Popconfirm, Space, Tooltip, Tag } from 'antd';
import { ExportOutlined,CalendarOutlined,ScheduleOutlined,PlusCircleOutlined, UserOutlined, PrinterOutlined, DeleteOutlined } from '@ant-design/icons';
import { getDeclaration, getTemplate } from '../../services/templateService';
import moment from 'moment';
import DeclarationForm from './declarationForm/DeclarationForm';

const { Search } = Input;

const Declaration = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [idClient, setidClient] = useState('');
  const [modalType, setModalType] = useState(null);

    const fetchData = async () => {

      try {
        const { data } = await getDeclaration();
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

  const handleAddTemplate = (idTemplate) => {
    openModal('Add', idTemplate);
  };

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idClient = '') => {
    closeAllModals();
    setModalType(type);
    setidClient(idClient);
  };
  

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
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


  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        <Tag icon={<ExportOutlined />} color="green">Export to Excel</Tag>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <Tag icon={<ExportOutlined />} color="blue">Export to PDF</Tag>
      </Menu.Item>
    </Menu>
  );

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
        render: (text) => (
          <Tag  color="blue">{text ?? 'Aucun'}</Tag>
        ),
      },
      {
        title: 'Periode',
        dataIndex: 'periode',
        key: 'periode',
        render: (text) => {
            const date = text ? new Date(text) : null;
                        const formattedDate = date 
                ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
                : 'Aucun';
    
            return (
                <Tag icon={<CalendarOutlined />} color='purple'>{formattedDate}</Tag>
            );
        },
    },    
    {
      title: 'M² occupe',
      dataIndex: 'm2_occupe',
      key: 'm2_occupe',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'M2 facture',
      dataIndex: 'm2_facture',
      key: 'm2_facture',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Tarif Entr',
      dataIndex: 'tarif_entreposage',
      key: 'tarif_entreposage',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
        title: 'debours entr',
        dataIndex: 'debours_entreposage',
        key: 'debours_entreposage',
        render: (text) => (
          <Tag color="blue">{text ?? 'Aucun'}</Tag>
        ),
      },
      {
        title: 'Total entr',
        dataIndex: 'total_entreposage',
        key: 'total_entreposage',
        render: (text) => (
          <Tag color="blue">{text ?? 'Aucun'}</Tag>
        ),
      },
      {
        title: 'TTC Entr',
        dataIndex: 'ttc_entreposage',
        key: 'ttc_entreposage',
        render: (text) => (
          <Tag color="blue">{text ?? 'Aucun'}</Tag>
        ),
      },
      {
        title: 'ville',
        dataIndex: 'name',
        key: 'name',
        render: (text) => (
          <Tag color="blue">{text ?? 'Aucun'}</Tag>
        ),
      },
    {
      title: 'Client',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <Tag>{text}</Tag>
      ),
    },
    {
        title: 'Batiment',
        dataIndex: 'nom_batiment',
        key: 'nom_batiment',
        render: (text) => (
          <Tag>{text}</Tag>
        ),
      },
      {
        title: 'Objet fact',
        dataIndex: 'nom_objet_fact',
        key: 'nom_objet_fact',
        render: (text) => (
          <Tag>{text}</Tag>
        ),
      },
      {
        title: 'Manutention',
        dataIndex: 'manutation',
        key: 'manutation',
        render: (text) => (
          <Tag color="blue">{text ?? 'Aucun'}</Tag>
        ),
      },
      {
        title: 'Tarif manu',
        dataIndex: 'tarif_manutation',
        key: 'tarif_manutation',
        render: (text) => (
          <Tag color="blue">{text ?? 'Aucun'}</Tag>
        ),
      },
      {
          title: 'debours manu',
          dataIndex: 'debours_manutation',
          key: 'debours_manutation',
          render: (text) => (
            <Tag color="blue">{text ?? 'Aucun'}</Tag>
          ),
        },
        {
          title: 'Total Manu',
          dataIndex: 'total_manutation',
          key: 'total_manutation',
          render: (text) => (
            <Tag color="blue">{text ?? 'Aucun'}</Tag>
          ),
        },
        {
          title: 'TTC Manu',
          dataIndex: 'ttc_manutation',
          key: 'ttc_manutation',
          render: (text) => (
            <Tag color="blue">{text ?? 'Aucun'}</Tag>
          ),
        }
  ]

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ScheduleOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Déclarations</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAddTemplate}
              >
                Ajouter une déclaration
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
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={1200}
        centered
      >
         <DeclarationForm closeModal={() => setModalType(null)} fetchData={fetchData} />
     </Modal>
    </>
  );
};

export default Declaration;
