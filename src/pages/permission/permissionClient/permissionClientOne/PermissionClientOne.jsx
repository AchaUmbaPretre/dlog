import React, { useEffect, useState } from 'react';
import { getUser } from '../../../../services/userService';
import { UnlockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Switch, Table, Tag, Button, Space, Tooltip, Modal } from 'antd';
import PermissionDeclarationOneClient from '../../permissionDeclaration/permissionDeclarationOneClient/PermissionDeclarationOneClient';

const  PermissionClientOne = ({ idClient }) => {
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
        
/*         if(idVille){
            const {data} = await getProvinceOne(idVille)
            setTitle(data[0].name)
        }  */

      } catch (error) {
        console.log(error);
      }
    };
    fetchPermission();
  }, [idClient]);


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
        <Tag color="blue">{`${record.nom} - ${record.prenom}`}</Tag>
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
            <h2 className="client-h2">Gestion des permissions</h2>
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
        <PermissionDeclarationOneClient idClient={idClient} idUser={idUser}/>
     </Modal>
    </>
  );
};

export default PermissionClientOne;
