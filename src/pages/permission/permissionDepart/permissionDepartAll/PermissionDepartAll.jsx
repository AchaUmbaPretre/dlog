import React, { useEffect, useState } from 'react';
import { Table, Button, Input, notification, Space, Tooltip, Tag, Modal } from 'antd';
import { InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { getDepartement } from '../../../../services/departementService';
import PermissionDepart from '../PermissionDepart';
import { getProvinceOne } from '../../../../services/clientService';
import PermissionDepartUser from '../permissionDepartUser/PermissionDepartUser';

const { Search } = Input;

const PermissionDepartAll = ({idVille}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [idDeparte, setIdDeparte] = useState('')
  const scroll = { x: 400 };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [title, setTitle] = useState('');

    const fetchData = async () => {
      try {
        const { data } = await getDepartement();
        setData(data);
        setLoading(false);


        if(idVille){
            const {data} = await getProvinceOne(idVille)
            setTitle(data[0].name)
        }
      } 
      catch (error) {
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

  const handleViewDetails = (id) => {
    openModal('detail', id);
  };

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, id = '') => {
    closeAllModals();
    setModalType(type);
    setIdDeparte(id);
  };  

  const columnStyles = {
    title: {
      maxWidth: '250px',
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
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "4%",    },
    {   
      title: 'Département',
      dataIndex: 'nom_departement', 
      key: 'nom_departement', 
      render: (text,record) => (
        <Space style={columnStyles.title} className={columnStyles.hideScroll} onClick={() => handleViewDetails(record.id_tache)}>
          <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
        </Space>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
          <Space size="middle">
            <Tooltip title="Voir les détails">
              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => handleViewDetails(record.id_departement)}
                aria-label="Voir les détails de la tâche"
                style={{ color: 'blue' }}
              />
            </Tooltip>
          </Space>
        )
    }
  ];

  const filteredData = data.filter(item =>
    item.nom_departement?.toLowerCase().includes(searchValue.toLowerCase())  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste des departements</h2>
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
            </div>
          </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={pagination}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="id"
                bordered
                size="middle"
                scroll={scroll}
            />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1070}
        centered
      >
        <PermissionDepartUser idDepartement={idDeparte} idVille={idVille}/>
      </Modal>

    </>
  );
};

export default PermissionDepartAll;
