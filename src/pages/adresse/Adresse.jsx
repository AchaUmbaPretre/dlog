import { useEffect, useRef, useState } from 'react';
import { Table, Input, Menu, Dropdown, Skeleton, Typography, notification, Button, Modal } from 'antd';
import { EnvironmentOutlined, MenuOutlined, DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
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
  const [statistique, setStatistique] = useState(null);
  const [columnsVisibility, setColumnsVisibility] = useState({
      'Batiment' : true,
      'Bin' : true,
      'Adresse' : true,
      'Superfice sol' : false,
      'Volume' : false
  });
  

  const fetchData = async () => {

      try {
        const { data } = await getAdresse(searchValue);
        setData(data.data);
        setStatistique(data.statistiques)
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
  }, [searchValue]);
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

  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation();
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

    const menus = (
      <Menu>
        {Object.keys(columnsVisibility).map(columnName => (
          <Menu.Item key={columnName}>
            <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
              <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
              <span style={{ marginLeft: 8 }}>{columnName}</span>
            </span>
          </Menu.Item>
        ))}
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
        ...(columnsVisibility['Batiment'] ? {} : { className: 'hidden-column' }),
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
      ...(columnsVisibility['Bin'] ? {} : { className: 'hidden-column' }),
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
      align: 'center',
      render: (text) => (
         <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent:'center' }}>
          <EnvironmentOutlined style={{color:'red'}} />
          <Text type="secondary">{text ?? 'Aucun'}</Text>    
        </div>
      ),
      ...(columnsVisibility['Adresse'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: 'Superfice sol',
      dataIndex: 'superfice_sol',
      key: 'superfice_sol',
      align: 'center',
        render: (text) => (
          <Text type="secondary">{text ?? 'Aucun'}</Text>
        ),
      ...(columnsVisibility['Superfice sol'] ? {} : { className: 'hidden-column' }),

    },
    {
      title: 'Volume (m³)',
      dataIndex: 'volume_m3',
      key: 'volume_m3',
      align: 'center',
        render: (text) => (
          <Text type="secondary">{text ?? 'Aucun'}</Text>
        ),
      ...(columnsVisibility['Volume'] ? {} : { className: 'hidden-column' }),
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
          <div className="client-rows">
            <div className="client-row">
              <div className="client-row-icon">
              🏢
              </div>
              <h2 className="client-h2">Liste d'adresses</h2>
            </div>
            <div className="client-row-lefts">
              <span className='client-title'>
                Resumé :
              </span>
              <div className="client-row-sou">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 1 }} />
                ) : (
                  <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px'}}>
                    <span style={{fontSize:'.8rem',  fontWeight:'200'}}>#Nbre de Bins : <strong>{statistique?.nbre_bins}</strong></span>
                    <span style={{fontSize:'.8rem',  fontWeight:'200'}}>#Nre de batiment : <strong>{Math.round(parseFloat(statistique?.nbre_batiment)).toLocaleString() || 0}</strong></span>
                    <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                      #Superficie sol : <strong>
                        { isNaN(parseFloat(statistique?.total_superficie)) 
                          ? 0 
                          : Math.round(parseFloat(statistique.total_superficie)).toLocaleString() }
                      </strong>
                    </span>

                    <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                      #Volume (m³) : <strong>
                        { isNaN(parseFloat(statistique?.total_volume)) 
                          ? 0 
                          : Math.round(parseFloat(statistique.total_volume)).toLocaleString() }
                      </strong>
                    </span>

                    </div>
                  )}
                    </div>
            </div>
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
              <Dropdown overlay={menus} trigger={['click']}>
                <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                  Colonnes <DownOutlined />
                </Button>
              </Dropdown>
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
