import { useEffect, useState } from 'react';
import { Table, Input, message,Button, notification, Popconfirm, Space, Tooltip, Tag, Modal } from 'antd';
import { ClusterOutlined,BankOutlined,DeleteOutlined,EditOutlined} from '@ant-design/icons';
import { getNiveau, putNiveauDelete } from '../../../services/batimentService';
import NiveauForm from './niveauForm/NiveauForm';

const { Search } = Input;

const Niveau = ({idBatiment}) => {
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [modalType, setModalType] = useState(null);
  const [idNiveau, setIdNiveau] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  const fetchData = async () => {

      try {
        const { data } = await getNiveau();
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

  const handleEdit = (idNiveau) => openModal('Edit', idNiveau)

  const openModal = (type, idNiveau = '') => {
    closeAllModals();
    setModalType(type);
    setIdNiveau(idNiveau);
  };

  const closeAllModals = () => {
    setModalType(null);
  };

  const handleDelete = async (id) => {
    try {
      await putNiveauDelete(id)
      setData(data.filter((item) => item.id_denomination_bat !== id));
      message.success('Dénomination a été supprimée');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

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
      title: 'Batiment',
      dataIndex: 'nom_batiment',
      key: 'nom_batiment',
      render: (text) => (
        <Tag icon={<BankOutlined />} color="green">{text ?? 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Niveau',
      dataIndex: 'nom_niveau',
      key: 'nom_niveau',
      render: (text) => (
        <Tag color="blue">{text ?? 'Aucun'}</Tag>
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
                onClick={() => handleEdit(record.id_niveau)}
                aria-label="Edit tache"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer ce client?"
                onConfirm={() => handleDelete(record.id_niveau)}
                okText="Oui"
                cancelText="Non"
              >
                <Button
                  icon={<DeleteOutlined />}
                  style={{ color: 'red' }}
                  aria-label="Delete client"
                />
              </Popconfirm>
            </Tooltip>
        </Space>
      ),
    },
  ]

  const filteredData = data.filter(item =>
    item.nom_niveau?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_batiment?.toLowerCase().includes(searchValue.toLowerCase())
   );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ClusterOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste des niveaux</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search 
                placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}

          />
        </div>
        <Modal
          title=""
          visible={modalType === 'Edit'}
          onCancel={closeAllModals}
          footer={null}
          width={700}
          centered
        >
          <NiveauForm idBatiment={''} closeModal={() => setModalType(null)} fetchData={fetchData} idNiveau={idNiveau} />
        </Modal>
      </div>
    </>
  );
};

export default Niveau;
