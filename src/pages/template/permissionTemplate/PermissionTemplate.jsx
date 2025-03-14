import React, { useEffect, useState } from 'react';
import { UnlockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Table, Tooltip, Space, Button, Modal} from 'antd';
import PermissionTemplateOne from './permissionTemplateOne/PermissionTemplateOne';
import { getUser } from '../../../services/userService';

const  PermissionTemplate = ({ idTemplate }) => {
    const scroll = { x: 400 };
    const [data, setData] = useState([]);
    const [title, setTitle] = useState('')
    const [idUser, setIdUser] = useState('');
    const [modalType, setModalType] = useState(null);
  
  useEffect(() => {
    const fetchPermission = async () => {
      try { 
        const { data: users } = await getUser();
        setData(users);

      } catch (error) {
        console.log(error);
      }
    };
    fetchPermission();
  }, [idTemplate]);

  const handleAddDeclaration = (id) => {
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
      dataIndex: 'menu_title',
      key: 'menu_title',
      render: (text, record) => (
        <div>
            {`${record.nom} ${record.prenom}`}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size='middle'>
            <Tooltip title="Voir les permissions pour ce client">
              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => handleAddDeclaration(record.id_utilisateur)}
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
            scroll={scroll}
            rowKey="id"
            bordered
            pagination={false}
            className="table_permission"
            size="small"
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
         <PermissionTemplateOne idTemplate={idTemplate} idUser={idUser}/>
      </Modal>
    </>
  );
};

export default PermissionTemplate;
