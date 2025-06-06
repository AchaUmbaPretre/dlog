import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  notification,
  Space,
  Tooltip,
  Tag,
  Modal,
  Tabs,
} from 'antd';
import {
  SolutionOutlined,
  UserOutlined,
  EyeOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import config from '../../config';
import { getUser } from '../../services/userService';
import PermissionOne from './permissionOne/PermissionOne';
import ListeTachePermi from './listeTachePermi/ListeTachePermi';
import PermissionVille from './permissionVille/PermissionVille';
import PermissionDeclaVille from './permissionDeclaVille/PermissionDeclaVille';
import PermissionClient from './permissionClient/PermissionClient';
import PermissionDepartAll from './permissionDepart/permissionDepartAll/PermissionDepartAll';
import PermissionProjet from './permissionProjet/PermissionProjet';

const { Search } = Input;

const Permission = () => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idUser, setIdUser] = useState('');
  const scroll = { x: 400 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getUser();
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

    fetchData();
  }, [DOMAIN]);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (_, __, index) => index + 1,
      width: '3%',
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <Space>
          <Tag icon={<UserOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => (
        <Space>
          <Tag icon={<SolutionOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Voir les permissions">
            <Button
              icon={<EyeOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record.id_utilisateur)}
              aria-label="voir"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (id) => {
    setIdUser(id);
    setIsModalVisible(true);
  };

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <UnlockOutlined className='client-icon' />
            <h2 className="client-h2">Permission</h2>
          </div>
          <Tabs 
            defaultActiveKey="0"
            type="card"
            tabPosition="top"
          >
            <Tabs.TabPane tab={
              <span>
                <UnlockOutlined style={{ color: '#D2691E' }} /> Permission d'options
              </span>
              } 
              key="0"
            >
              <div className="client-actions">
                <div className="client-row-left">
                  <Search placeholder="recherche..." enterButton />
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 15 }}
                rowKey="id_utilisateur"
                bordered
                size="middle"
                scroll={scroll}
                loading={loading}
              />
            </Tabs.TabPane>

            <Tabs.TabPane tab= {
              <span>
                <UnlockOutlined style={{ color: '#D2691E' }} /> Permission des taches
              </span>
              } 
              key="2"
            >
              <Tabs 
                defaultActiveKey="0"
                type="card"
                tabPosition="top"
              >
                <Tabs.TabPane tab= {
                  <span>
                    <UnlockOutlined style={{ color: '#D2691E' }} /> Par tache
                  </span>
                  } 
                  key="1"
                >
                  <ListeTachePermi/>
                </Tabs.TabPane>

                <Tabs.TabPane tab= {
                  <span>
                    <UnlockOutlined style={{ color: '#D2691E' }} /> Par ville
                  </span>
                    }  
                  key="2"
                >
                  <PermissionVille/>
                </Tabs.TabPane>

                <Tabs.TabPane tab= {
                  <span>
                    <UnlockOutlined style={{ color: '#D2691E' }} /> Par Département
                  </span>
                    }  
                  key="3"
                >
                  <PermissionDepartAll/>
                </Tabs.TabPane>

              </Tabs>
            </Tabs.TabPane>

            <Tabs.TabPane tab= {
              <span>
                <UnlockOutlined style={{ color: '#D2691E' }} /> Permission des déclarations
              </span>
                } 
              key="4"
            >
              <Tabs 
                defaultActiveKey="0"
                type="card"
                tabPosition="top"
              >
                <Tabs.TabPane tab= {
                  <span>
                    <UnlockOutlined style={{ color: '#D2691E' }} /> Par ville
                  </span>
                    } 
                  key="1"
                >
                  <PermissionDeclaVille/>
                </Tabs.TabPane>

                <Tabs.TabPane tab= {
                  <span>
                    <UnlockOutlined style={{ color: '#D2691E' }} /> Par client
                  </span>
                    } 
                  key="2"
                >
                  <PermissionClient/>
                </Tabs.TabPane>
              </Tabs>
            </Tabs.TabPane>
            <Tabs.TabPane tab= {
              <span>
                <UnlockOutlined style={{ color: '#000' }} /> Permission des projets
              </span>
                    } 
                  key="5"
            >
              <PermissionProjet/>
            </Tabs.TabPane>

          </Tabs>
        </div>
      </div>

      <Modal
        title=""
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={950}
        size="small"
      >
        <PermissionOne userId={idUser} />
      </Modal>
    </>
  );
};

export default Permission; 