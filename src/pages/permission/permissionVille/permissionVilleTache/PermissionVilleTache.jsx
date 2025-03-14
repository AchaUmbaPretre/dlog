import React, { useEffect, useState } from 'react';
import { getUser } from '../../../../services/userService';
import { UnlockOutlined, InfoCircleOutlined, EnvironmentOutlined, SafetyOutlined  } from '@ant-design/icons';
import { Table, Tooltip, Space, Button, Modal, Tag} from 'antd';
import { getProvinceOne } from '../../../../services/clientService';
import PermissionVilleOne from '../permissionVilleOne/PermissionVilleOne';

const  PermissionVilleTache = ({ idVille }) => {
    const scroll = { x: 400 };
    const [data, setData] = useState([]);
    const [title, setTitle] = useState('')
    const [idUser, setIdUser] = useState('');
    const [modalType, setModalType] = useState(null);
    const [loading, setLoading] = useState(true); 
  
  useEffect(() => {
    const fetchPermission = async () => {
      try { 
        setLoading(true);

        const { data: users } = await getUser();
        setData(users);

        if(idVille){
            const {data} = await getProvinceOne(idVille)
            setTitle(data[0].capital)
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
    }
    };
    fetchPermission();
  }, [idVille]);

  const handleAddTache = (id) => {
    openModal('Add', id);
  }

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idUser = '') => {
    closeAllModals();
    setModalType(type);
    setIdUser(idUser);
  };

  // Colonnes du tableau
  const columns = [
    {
      title: <span>#</span>,
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: '3%',
    },
    {
      title: 'Utilisateur',
      dataIndex: 'nom',
      key: 'nom',
      render: (text, record) => (
        <div>
            {`${record.nom} ${record.prenom}`}
        </div>
      ),
    },
    { title: 'Role', 
      dataIndex: 'role', 
      key: 'role',
      render: text => (
        <Space>
          <Tag icon={<SafetyOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { title: 'Ville', 
      dataIndex: 'name', 
      key: 'name',
      render: text => (
        <Space>
          <Tag icon={<EnvironmentOutlined />} color='orange'>{text ?? 'N/A'}</Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size='middle'>
            <Tooltip title={`Voir les permissions de ${record.nom}`}>
              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => handleAddTache(record.id_utilisateur)}
                aria-label="Voir les détails"
                style={{ color: 'blue' }}
              />
            </Tooltip>
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
              <UnlockOutlined className="client-icon" />
            </div>
            <h2 className="client-h2">Gestion des permissions pour la ville de {title} </h2>
          </div>
          <Table
            dataSource={data}
            columns={columns}
            scroll={scroll
            }
            rowKey="id"
            bordered
            pagination={false}
            className="table_permission"
            size="small"
            loading={loading}
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
         <PermissionVilleOne idVille={idVille} userId={idUser}/>
      </Modal>
    </>
  );
};

export default PermissionVilleTache;
