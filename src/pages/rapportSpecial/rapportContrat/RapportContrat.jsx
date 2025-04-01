import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input,Space, message, Dropdown, Menu, notification, Tag } from 'antd';
import { ExportOutlined,TagOutlined, FileTextOutlined, MoreOutlined, FormOutlined, PrinterOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import RapportContratForm from './rapportContratForm/RapportContratForm';
import { getContratRapport } from '../../../services/rapportService';
import RapportParametre from '../rapportParametre/RapportParametre';
import RapportParametreListe from '../rapportParametre/rapportParametreListe/RapportParametreListe';
import ElementContrat from '../elementContrat/ElementContrat';
import ElementContratList from '../elementContrat/elementContratList/ElementContratList';

const { Search } = Input;

const RapportContrat = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };
  const [modalType, setModalType] = useState(null); 
  const [idContrat, setIdContrat] = useState('')
  
  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, id = '') => {
    closeAllModals();
    setModalType(type);
    setIdContrat(id)
  };

const handleParametre = (id) => {
    openModal('parametre', id)
  }

const handleParametreListe = (id) => {
    openModal('parametreListe', id)
  }

const handleElementContrat = (id) => {
    openModal('elementContrat', id)
  }

const handleElementContratListe = (id) => {
    openModal('elementContratListe', id)
  }
  
    const fetchData = async () => {
      try {
        const { data } = await getContratRapport();
  
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
    message.success('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = (record) => {
    message.info(`Modification fournisseur : ${record.nom}`);
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
        title: 'Titre',
        dataIndex: 'nom_contrat',
        key: 'nom_contrat',
        render: (text) => (
            <Tag icon={<TagOutlined />} color="blue">{text}</Tag>
        ),
    },
    {
        title: 'Superfice',
        dataIndex: 'superfice',
        key: 'superfice',
        render: (text) => (
            <Tag color="blue">{text}</Tag>
        ),
    },
    {
        title: 'Tarif camion',
        dataIndex: 'tarif_camion',
        key: 'tarif_camion',
        render: (text) => (
            <Tag color={text > 1 ? 'blue' :' red'}>
                {text}
            </Tag>
        ),
    },
    {
        title: 'Tarif camion',
        dataIndex: 'tarif_palette',
        key: 'tarif_palette',
        render: (text) => (
            <Tag color={text > 1 ? 'blue' :' red'}>
                {text}
            </Tag>
        ),
    },
    {
        title: 'Tarif tonne',
        dataIndex: 'tarif_tonne',
        key: 'tarif_tonne',
        render: (text) => (
            <Tag color={text > 1 ? 'blue' :' red'}>
                {text}
            </Tag>
        ),
    },
    {
        title: "Actions",
        dataIndex: 'actions',
        key: 'action',
        render: (text, record) => (
            <Space>
                <Dropdown
                    overlay={(
                    <Menu>
                        {/* Actions Document */}
                        <Menu.Item onClick={() => handleParametre(record.id_contrats_rapport)}>
                            <FormOutlined /> Parametre
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item onClick={() => handleParametreListe(record.id_contrats_rapport)}>
                            <FileTextOutlined style={{color:'blue'}}/> Liste des parametres
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item onClick={() => handleElementContrat(record.id_contrats_rapport)}>
                            <FormOutlined style={{color:'green'}}/> Element contrat
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item onClick={() => handleElementContratListe(record.id_contrats_rapport)}>
                            <FileTextOutlined style={{color:'blue'}}/> Liste d'elements contrats
                        </Menu.Item>
                        <Menu.Divider />
                    </Menu>
                        )}
                    trigger={['click']}
                >
                    <Button
                        icon={<MoreOutlined />}
                        style={{ color: 'black', padding: '0' }}
                        aria-label="Menu actions"
                    />
                </Dropdown>
            </Space>
        )
    }
];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <TeamOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Contrat</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter un contrat
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
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <RapportContratForm closeModal={() => setIsModalVisible(false)} fetchData={fetchData}/>
      </Modal>

        <Modal
            title=""
            visible={modalType === 'parametre'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <RapportParametre fetchData={fetchData} closeModal={()=>setModalType(null)} idContrat={idContrat} />
         </Modal>

        <Modal
            title=""
            visible={modalType === 'parametreListe'}
            onCancel={closeAllModals}
            footer={null}
            width={700}
            centered
        >
            <RapportParametreListe fetchData={fetchData} closeModal={()=>setModalType(null)}/>
        </Modal>

        <Modal
            title=""
            visible={modalType === 'elementContrat'}
            onCancel={closeAllModals}
            footer={null}
            width={700}
            centered
        >
            <ElementContrat fetchData={fetchData} closeModal={()=>setModalType(null)}/>
        </Modal>

        <Modal
            title=""
            visible={modalType === 'elementContratListe'}
            onCancel={closeAllModals}
            footer={null}
            width={700}
            centered
        >
            <ElementContratList fetchData={fetchData} closeModal={()=>setModalType(null)}/>
        </Modal>
    </>
  );
};

export default RapportContrat;
