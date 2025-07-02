import { useEffect, useRef, useState } from 'react';
import { Table, Input, Typography, notification, Button, Modal } from 'antd';
import { EnvironmentOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getAdresse } from '../../services/batimentService';
import AdresseForm from './adresseForm/AdresseForm';
import getColumnSearchProps from '../../utils/columnSearchUtils';

const { Search } = Input;
const { Text } = Typography;


const Adresse = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const scroll = { x: 400 };
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 20,
    });

      const fetchData = async () => {

      try {
        const { data } = await getAdresse();
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
;

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idBin = '') => {
    closeAllModals();
    setModalType(type);
  };

  const handleAddBin = (idBin) => {
    openModal('Add', idBin);
  }

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
      width: "3%"
    },
    {
        title: 'Batiment',
        dataIndex: 'nom_batiment',
        ...getColumnSearchProps(
        'nom_batiment',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput,
            searchedColumn
        ),
        key: 'nom_batiment',
        align: 'center',
        render: (text) => (
          <Text type="secondary">{text ?? 'Aucun'}</Text>
        ),
    },
    {
        title: 'Bin',
        dataIndex: 'nom',
        ...getColumnSearchProps(
        'nom',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput,
            searchedColumn
        ),
        key: 'nom',
        align: 'center',
        render: (text) => (
          <Text type="secondary">{text ?? 'Aucun'}</Text>
        ),
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      ...getColumnSearchProps(
        'adresse',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput,
            searchedColumn
        ),
      key: 'adresse',
      render: (text) => (
         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <EnvironmentOutlined style={{color:'red'}} />
          <Text type="secondary">{text ?? 'Aucun'}</Text>    
        </div>
      ),
    },
    {
      title: 'superfice sol',
      dataIndex: 'superfice_sol',
      key: 'superfice_sol',
      align: 'center',
        render: (text) => (
          <Text type="secondary">{text ?? 'Aucun'}</Text>
        ),
    },
    {
      title: 'Volume (m³)',
      dataIndex: 'volume_m3',
      key: 'volume_m3',
      align: 'center',
        render: (text) => (
          <Text type="secondary">{text ?? 'Aucun'}</Text>
        ),
    }
  ]

  const filteredData = data.filter(item =>
        item.adresse?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom_batiment?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom?.toLowerCase().includes(searchValue.toLowerCase())
   );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
            🏢
            </div>
            <h2 className="client-h2">Liste d'adresses</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search 
                placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAddBin}
              >
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>

        <Modal
          title=""
          visible={modalType === 'Add'}
          onCancel={closeAllModals}
          footer={null}
          width={800}
          centered
        >
          <AdresseForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

      </div>
    </>
  );
};

export default Adresse;
