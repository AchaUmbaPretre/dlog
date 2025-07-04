import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag } from 'antd';
import { ExportOutlined, PrinterOutlined, ContainerOutlined, ApartmentOutlined,EditOutlined, DeleteOutlined} from '@ant-design/icons';
import { getBinsOne, putDeleteBins } from '../../../services/batimentService';
import BinForm from '../bins/binsForm/BinForm';
import AdresseForm from '../../adresse/adresseForm/AdresseForm';

const { Search } = Input;

const Bins = ({idBatiment}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [nameBatiment, setNameBatiment] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [idBin, setIdBin] = useState(null);
  const scroll = { x: 400 };

  const handleAddBin = (id) => openModal('Addresse', id);

  const handleAddClient = (id) => openModal('Add', id)

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, id = '') => {
    setModalType(type);
    setIdBin(id)
  };

  const handleDelete = async (id) => {
    try {
      await putDeleteBins(id);
      setData(data.filter((item) => item.id !== id));
      message.success('Le bin a été supprimé avec succès.');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

    const fetchData = async () => {
      try {
         const { data } = await getBinsOne(idBatiment);
        setData(data);
        setNameBatiment(data[0]?.nom_batiment)
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

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "4%"
    },
    { 
      title: 'Nom', 
      dataIndex: 'nom', 
      key: 'nom',
      render: (text, record) => (
        <Space onClick={()=>handleAddBin(record.id)}>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Superficie', 
      dataIndex: 'superficie', 
      key: 'superficie',
      render: text => (
        <Tag color='volcano'>{text ? `${text} m²` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Longueur', 
      dataIndex: 'longueur', 
      key: 'longueur',
      render: text => (
        <Tag color='geekblue'>{text ? `${text} L` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Largeur', 
      dataIndex: 'largeur', 
      key: 'largeur',
      render: text => (
        <Tag color='geekblue'>{text ? `${text} W` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Hauteur', 
      dataIndex: 'hauteur', 
      key: 'hauteur',
      render: text => (
        <Tag color='geekblue'>{text ? `${text} H` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Capacité', 
      dataIndex: 'capacite', 
      key: 'capacite',
      render: text => (
        <Tag color='gold'>{text ? `${text} m³` : "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Statut', 
      dataIndex: 'statut', 
      key: 'statut',
      render: text => (
        <Tag color='green'>{text || "Non spécifié"}</Tag>
      ),
    },
    { 
      title: 'Type de Stockage', 
      dataIndex: 'type_stockage', 
      key: 'type_stockage',
      render: text => (
        <Tag color='purple'>{text || "Non spécifié"}</Tag>
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
              aria-label="Modifier entrepôt"
              onClick={() => handleAddClient(record.id)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cet entrepôt ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Supprimer entrepôt"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  

  const filteredData = data.filter(item =>
    item.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.statut?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ContainerOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Liste des Bins de {nameBatiment}</h2>
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
                Entrepot
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
            rowKey="key"
            bordered
            size="middle"
            scroll={scroll}
            loading={loading}
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <BinForm idBatiment={idBatiment} closeModal={() => setIsModalVisible(false)} fetchData={fetchData} idBin={idBin} />
     </Modal>

     <Modal
        title=""
        visible={modalType === 'Addresse'}
        onCancel={closeAllModals}
        width={900}
        centered
      >
        <AdresseForm closeModal={()=>setModalType(null)} fetchData={fetchData}  />
      </Modal>
    </>
  );
};

export default Bins;
