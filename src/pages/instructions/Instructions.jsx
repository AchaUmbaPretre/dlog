import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag } from 'antd';
import { ExportOutlined, HomeOutlined, FileTextOutlined, FormOutlined, EyeOutlined,MoreOutlined, PrinterOutlined,EditOutlined, PlusCircleOutlined,DeleteOutlined} from '@ant-design/icons';
import { getInspection, putInspectionDelete } from '../../services/batimentService';
import InstructionForm from './instructionForm/InstructionForm';
import InstructionsDetail from './instructionsDetail/InstructionsDetail';
import InstructionFormEdit from './instructionForm/InstructionFormEdit';
import InstructionFormApres from './instructionForm/InspectionFormApres';
import InspectionTache from './inspectionTache/InspectionTache';

const { Search } = Input;

const Instructions = ({idTache}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [idInspection, setIdInspection] = useState('');
  const scroll = { x: 400 };
  const [modalType, setModalType] = useState(null);

  const handleAddInstruction = (id) => {
    openModal('add', id);
    setIdInspection(id)
  };

  const handleEdit = (id) => {
    openModal('edit', id);
    setIdInspection(id)
  };

  const handleViewDetails = (id) => {
    openModal('detail', id);
    setIdInspection(id)
  }

  const handleApres = (id) => {
    openModal('addApres', id)
    setIdInspection(id)
  }

  const handleTache = (id) => {
    openModal('relieTache', id)
    setIdInspection(id)
  }

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idInspection = '') => {
    setModalType(type);
    setIdInspection(idInspection);
  };

  const handleDelete = async (id) => {
    try {
       await putInspectionDelete(id);
      setData(data.filter((item) => item.id_inspection !== id));
      message.success('Inspection a ete supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

    const fetchData = async () => {
      try {
        const { data } = await getInspection(idTache);
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
  }, [idTache]);

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
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

    const columnStyles = {
    title: {
      maxWidth: '220px',
      whiteSpace: 'nowrap',
      overflowX: 'scroll', 
      overflowY: 'hidden',
      textOverflow: 'ellipsis',
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none', 
    },
    hideScroll: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  };

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
          <Tag icon={<HomeOutlined />} color='green'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
    },
    { 
        title: 'Commentaire', 
        dataIndex: 'commentaire', 
        key: 'commentaire',
        render: text => (
          <Space style={columnStyles.title} className={columnStyles.hideScroll}>
            <Tag color='cyan'>{text}</Tag>
          </Space>
        ),
      },
      { 
        title: 'Categorie', 
        dataIndex: 'nom_cat_inspection', 
        key: 'nom_cat_inspection',
        render: text => (
          <Space>
            <Tag color='cyan'>{text}</Tag>
          </Space>
        ),
      },
      {
        title: "Type",
        dataIndex: 'nom_type_instruction',
        key: 'nom_type_instruction',
        render: text => {
          return (
            <Space>
              <Tag color={"green"}>
                 {text}
              </Tag>
            </Space>
          );
        }
      },
      {
        title: "Tache",
        dataIndex: 'nom_tache',
        key: 'nom_tache',
        render: text => {
          return (
            <Space style={columnStyles.title} className={columnStyles.hideScroll}>
              <Tag icon={<FileTextOutlined />} color={"cyan"}>
                 {text ?? 'Aucune'}
              </Tag>
            </Space>
          );
        }
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
              onClick={() => handleEdit(record.id_inspection)}
              aria-label="Edit department"
            />
          </Tooltip>
          <Tooltip title="Voir les détails">
              <Button
                icon={<EyeOutlined />}
                onClick={() => handleViewDetails(record.id_inspection)}
                aria-label="Voir les détails de la tâche"
                style={{ color: 'blue' }}
              />
          </Tooltip>
          <Dropdown
            overlay={(
              <Menu>
                <Menu.Item onClick={() => handleApres(record.id_inspection)}>
                  <FormOutlined /> Mettre à jour l'inspection
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={() => handleTache(record.id_inspection)}>
                  <FormOutlined /> Relier tache
                </Menu.Item>
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
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Etes-vous sûr de vouloir supprimer ce département ?"
              onConfirm={() => handleDelete(record.id_inspection)}
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
    item.commentaire?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_batiment?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
                📝
            </div>
            <h2 className="client-h2">Liste des inspections</h2>
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
                onClick={handleAddInstruction}
              >
                Inspection
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
            size="small"
            scroll={scroll}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'add'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
      >
        <InstructionForm idBatiment={''} closeModal={closeAllModals} fetchData={fetchData} idInspection={''} idTache={null}/>
      </Modal>
      <Modal
        title=""
        visible={modalType === 'edit'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <InstructionFormEdit idBatiment={''} closeModal={closeAllModals} fetchData={fetchData} idInspection={idInspection}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1025}
        centered
      >
        <InstructionsDetail idInspection={idInspection}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'addApres'}
        onCancel={closeAllModals}
        footer={null}
        width={1025}
        centered
      >
        <InstructionFormApres closeModal={closeAllModals} fetchData={fetchData} idInspection={idInspection}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'relieTache'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <InspectionTache closeModal={closeAllModals} fetchData={fetchData} idInspection={idInspection}/>
      </Modal>
    </>
  );
};

export default Instructions;
