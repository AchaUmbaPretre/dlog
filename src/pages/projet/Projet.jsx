import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, InputNumber, Form } from 'antd';
import { ExportOutlined, DollarOutlined,CalendarOutlined, PrinterOutlined, EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../config';
import BudgetForm from './budgetForm/BudgetForm';
import { getBudget, putBudget } from '../../services/budgetService';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

const { Search } = Input;

const Projet = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleViewDetails = (record) => {
    message.info(`Viewing details of tache: ${record.article}`);
  };

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
    message.success('Exporting to PDF...');
  };

  const handleDelete = async (id) => {
    try {
      // Fonction de suppression commentée
      // await deleteClient(id);
      setData(data.filter((item) => item.id_budget !== id));
      message.success('Budget supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du budget.',
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getBudget();
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

  const handleEdit = (record) => {
    setEditingRow(record.id_budget);
    form.setFieldsValue({ quantite_validee: record.quantite_validee });
  };

  const handleSave = async (id) => {
    try {
      const values = await form.validateFields();
      await putBudget(id, { quantite_validee: values.quantite_validee });
      setData(data.map(item => item.id_budget === id ? { ...item, quantite_validee: values.quantite_validee } : item));
      setEditingRow(null);
      message.success('Quantité validée mise à jour avec succès');
      window.location.reload();
    } catch (error) {
      notification.error({
        message: 'Erreur de mise à jour',
        description: 'Une erreur est survenue lors de la mise à jour de la quantité validée.',
      });
    }
  };

  const columns = [
    { 
      title: '#', 
      dataIndex: 'id_budget', 
      key: 'id_budget', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    { 
      title: 'Items', 
      dataIndex: 'article', 
      key: 'article',
      render: text => (
        <Space>
          <Tag color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Qté demandée', 
      dataIndex: 'quantite_demande', 
      key: 'quantite_demande',
      render: text => (
        <Tag color='geekblue'>{text}</Tag>
      ),
    },
    { 
      title: 'Qté validée', 
      dataIndex: 'quantite_validee',
      key: 'quantite_validee',
      render: (text, record) => (
        editingRow === record.id_budget ? (
          <Form form={form} layout="inline">
            <Form.Item
              name="quantite_validee"
              rules={[{ required: true, message: 'Veuillez entrer la quantité validée' }]}
            >
              <InputNumber min={0} placeholder="Quantité validée" style={{ width: '100%' }} />
            </Form.Item>
            <Button type="primary" onClick={() => handleSave(record.id_budget)}>Confirmer</Button>
          </Form>
        ) : (
          <Space>
            <Tag color={text === null ? 'red' : 'blue'}>{text === null ? "non validée" : text}</Tag>
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}></Button>
          </Space>
        )
      ),
    },
    { 
      title: 'P.U', 
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire',
      render: text => (
        <Space>
          <Tag color={text === null ? 'red' : 'blue'}>{text === null ? "non validée" : `${text} $`}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Montant', 
      dataIndex: 'montant',
      key: 'montant',
      render: text => (
        <Space>
          <Tag color={text === null ? 'red' : 'blue'}>{text === null ? "non validée" : `${text} $`}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Montant validé', 
      dataIndex: 'montant_valide',
      key: 'montant_valide',
      render: text => (
        <Space>
          <Tag color={text === null ? 'red' : 'blue'}>{text === null ? "non validée" : `${text} $`}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Date', 
      dataIndex: 'date_creation', 
      key: 'date_creation',
      render: text => (
        <Tag icon={<CalendarOutlined />}  color='purple'>{moment(text).format('LL')}</Tag>
      ),
    },
    { 
      title: 'Fournisseurs', 
      dataIndex: 'fournisseur', 
      key: 'fournisseur',
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
          <Tooltip title="Voir détails">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              aria-label="View budget details"
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record)}
              aria-label="Edit budget"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce budget ?"
              onConfirm={() => handleDelete(record.id_budget)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Delete budget"
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
            rowKey="id_budget"
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
      >
        <BudgetForm/>
      </Modal>
    </>
  );
};

export default Projet;
