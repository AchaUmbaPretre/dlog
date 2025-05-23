import React, { useEffect, useState } from 'react';
import { getUser } from '../../../../services/userService';
import { UnlockOutlined, InfoCircleOutlined, UserOutlined, ApartmentOutlined } from '@ant-design/icons';
import { Table, Tooltip, Space, Button, Modal, Spin, Tag  } from 'antd';
import PermissionDepart from '../PermissionDepart';

const PermissionDepartUser = ({ idDepartement }) => {
    const scroll = { x: 400 };
    const [data, setData] = useState([]);
    const [idUser, setIdUser] = useState('');
    const [modalType, setModalType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermission = async () => {
            try {
                setLoading(true); 
                const { data: users } = await getUser();
                setData(users);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPermission();
    }, [idDepartement]);

    const handleAddDeclaration = (id) => {
        openModal('Add', id);
    };

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type, idUser = '') => {
        closeAllModals();
        setModalType(type);
        setIdUser(idUser);
    };

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
                <Space>
                    <Tag icon={<UserOutlined />} color="green">
                    {record.nom && record.prenom
                        ? `${record.nom} - ${record.prenom}`
                        : record.nom || record.prenom || 'Aucun'}
                    </Tag>
                </Space>
            ),
        },
        { title: 'Departement', 
            dataIndex: 'nom_departement', 
            key: 'nom_departement',
            render: text => (
              <Space>
                <Tag icon={<ApartmentOutlined />} color='cyan'>{text ?? 'N/A'}</Tag>
              </Space>
            ),
          },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Voir les permissions pour ce client">
                        <Button
                            icon={<InfoCircleOutlined />}
                            onClick={() => handleAddDeclaration(record.id_utilisateur)}
                            aria-label="Voir les détails"
                            style={{ color: 'blue' }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
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

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            dataSource={data}
                            columns={columns}
                            scroll={scroll}
                            rowKey="id"
                            bordered
                            pagination={false}
                            className="table_permission"
                            size="small"
                            loading={loading} // Affichage du spinner dans le tableau
                        />
                    )}
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
                <PermissionDepart idDepartement={idDepartement} userId={idUser} />
            </Modal>
        </>
    );
};

export default PermissionDepartUser;
