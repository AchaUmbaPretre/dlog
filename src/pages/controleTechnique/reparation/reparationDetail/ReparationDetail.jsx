import React, { useEffect, useState } from 'react';
import { Card, Button, Skeleton, Tooltip, Modal, Divider, Space, Table, notification, Typography, Tag } from 'antd';
import { EyeOutlined, ToolOutlined, UserOutlined, ExclamationOutlined } from '@ant-design/icons';
import { getReparationOne, getSuiviReparation } from '../../../../services/charroiService';
import moment from 'moment';
import './reparationDetail.scss'
import { statusIcons } from '../../../../utils/prioriteIcons';
import SuiviReparationForm from '../suiviReparation/suiviReparationForm/SuiviReparationForm';
import ReclamationForm from '../reclamationForm/ReclamationForm';

const { Title } = Typography;

const ReparationDetail = ({ idReparation, inspectionId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });
    const [modalType, setModalType] = useState(null);
    const [idReparations, setIdReparations] = useState(null);
    const [dataThree, setDataThree] = useState([]);
    const [dataFour, setDataFour] = useState([]);

    const closeAllModals = () => {
        setModalType(null);
      };

      const openModal = (type, id='') => {
        closeAllModals();
        setModalType(type);
        setIdReparations(id)
      };

    const handleDetails = (id) => openModal('Add', id);

    const handleReclamation = (id) => openModal('Reclamation', id)

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getReparationOne(idReparation);

            const res = await getSuiviReparation(idReparation);

            setDataThree(res?.data);
            setData(response?.data?.data);
            setDetail([response?.data?.dataGen[0]]);

        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idReparation) {
            fetchData();
        }
    }, [idReparation]);

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
/*             {   title: 'Matricule', 
                dataIndex: 'immatriculation', 
                key: 'immatriculation', 
                render: (text) => <Tag color="blue">{text}</Tag> 
            },
            {   title: 'Marque', 
                dataIndex: 'nom_marque', 
                key: 'nom_marque', 
                render: (text) => <Tag color="blue">{text}</Tag> 
            }, */
            {   title: 'Date début', 
                dataIndex: 'date_entree', 
                key: 'date_entree', 
                render: (text) => 
                <Tag color='purple'>{moment(text).format('LL')}</Tag> 
            },
            {   title: 'Date fin', 
                dataIndex: '"date_sortie', 
                key: '"date_sortie', 
                render: (text) => 
                <Tag color='purple'>{moment(text).format('LL')}</Tag> 
            },
            {   title: 'Fournisseur', 
                dataIndex: 'nom_fournisseur', 
                key: 'fournisseur', 
                render: (text) => <Tag color="blue">{text}</Tag> 
            },
            {   title: 'Budget', 
                dataIndex: 'cout', 
                key: 'cout', 
                render: (text) => <Tag color="blue">{text} $</Tag> 
            }
    ]

    const columnsTwo = [
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
            {   title: 'Déscription', 
                dataIndex: 'description', 
                key: 'description', 
                render: (text) => <div>{text}</div> 
            },
            {   title: 'Categorie',
                dataIndex: 'type_rep',
                render: (text) => (
                    <Tag icon={<ToolOutlined spin />} color='volcano' bordered={false}>
                        {text}
                    </Tag>
                ),
            },
            { 
                title: 'Statut', 
                dataIndex: 'nom_evaluation', 
                key: 'nom_evaluation',
                render: text => {
                    return (
                        <Space>
                            <Tag>{text}</Tag>
                        </Space>
                    );
                },            
            },
            { 
                title: 'Statut final', 
                dataIndex: 'nom_type_statut', 
                key: 'nom_type_statut',
                render: text => {
                    const { icon, color } = statusIcons[text] || {};
                    return (
                        <Space>
                            <Tag icon={icon} color={color}>{text}</Tag>
                        </Space>
                    );
                },            
            },
            {
                title: 'Suivi',
                dataIndex: 'tracking', 
                key:'tracking',
                width: '9px',
                render: (text, record) => (
                    <>
                        <Tooltip title="Faire un suivi">
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() => handleDetails(record.id_sud_reparation)}
                                aria-label="Voir les détails"
                                style={{ color: 'blue' }}
                            />
                        </Tooltip>
                    </>
                )
            },
            {
                title: 'Récla.',
                dataIndex: 'reclamation', 
                key:'reclamation',
                width: '9px',
                render: (text, record) => (
                    <>
                        <Tooltip title="Réclamation">
                            <Button
                                onClick={() => handleReclamation(record.id_sud_reparation)}
                                icon={<ExclamationOutlined />}
                                aria-label="Voir les détails"
                                style={{ color:'red' }}
                            />
                        </Tooltip>
                    </>
                )
            }
    ]

    const columnsThree = [
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
        {   title: 'Taches accomplie', 
            dataIndex: 'nom_cat_inspection', 
            key: 'nom_cat_inspection', 
            render: (text) => 
            <div> {text}</div>
        },
        {   title: 'Piéce', 
            dataIndex: 'type_rep', 
            key: 'type_rep', 
            render: (text) => (
                <Tag icon={<ToolOutlined spin />} color='volcano' bordered={false}>
                    {text}
                </Tag>
            ),
        },
        {   title: 'Budget', 
            dataIndex: 'budget', 
            key: 'budget', 
            render: (text) => <div>{text} $</div> 
        },
        {   title: 'Effectué par', 
            dataIndex: 'nom', 
            key: 'nom', 
            render: (text) => <Tag icon={<UserOutlined />}  color="blue">{text}</Tag> 
        }
    ]

    const columnsFour = [
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
        {   title: 'Reclamation:', 
            dataIndex: 'reclamation', 
            key: 'nom_cat_inspection', 
            render: (text) => 
            <div> {text}</div>
        },
        {   title: 'Motif', 
            dataIndex: 'motif', 
            key: 'motif', 
            render: (text) => (
                <Tag color='volcano' bordered={false}>
                    {text}
                </Tag>
            ),
        },
        {   title: 'Description', 
            dataIndex: 'description', 
            key: 'description', 
            render: (text) => <div>{text}</div> 
        },
        {   title: 'Date recla.', 
            dataIndex: '"date_reclamation', 
            key: '"date_reclamation', 
            render: (text) => 
            <Tag color='purple'>{moment(text).format('LL')}</Tag> 
        },
        {   title: 'Date fin.', 
            dataIndex: '"date_fin', 
            key: '"date_fin', 
            render: (text) => 
            <Tag color='purple'>{moment(text).format('LL')}</Tag> 
        },
        {   title: 'Statut reclam.', 
            dataIndex: 'statut_reclam', 
            key: 'nom', 
            render: (text) => <Tag color="blue">{text}</Tag> 
        },
        {   title: 'Budget', 
            dataIndex: 'budget', 
            key: 'budget', 
            render: (text) => <Tag color="green">{text}</Tag> 
        },
        {   title: 'Créer par', 
            dataIndex: 'utilisateur', 
            key: 'utilisateur', 
            render: (text) => <Tag color="blue">{text}</Tag> 
        }
    ]

    return (
        <>
            <div className="reparation_detail">
                <div className="reparation_detail_title">
                    <h1 className="reparation_detail_h1">SUIVI D'INTERVENTION : {detail[0]?.nom_marque.toUpperCase()} {detail?.[0]?.immatriculation}</h1>
                </div>
                <Card>
                    <div className="reparation_detail_wrapper">
                        <Divider style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>INFORMATIONS GENERALES</Divider>
                        <Card className='reparation_detail_card'>
                            <div className="reparation_detail_top">
                                <Skeleton loading={loading} active paragraph={false}>
                                    <Table
                                        columns={columns}
                                        dataSource={detail}
                                        onChange={(pagination) => setPagination(pagination)}
                                        pagination={pagination}
                                        rowKey="id"
                                        bordered
                                        size="small"
                                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                                    />
                                </Skeleton>
                            </div>
                        </Card>
                        <Divider style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>DETAIL DES REPARATIONS</Divider>
                        <Card>
                            <div className="reparation_detail_top">
                                <Skeleton loading={loading} active paragraph={false}>
                                    <Table
                                        columns={columnsTwo}
                                        dataSource={data}
                                        onChange={(pagination) => setPagination(pagination)}
                                        pagination={pagination}
                                        rowKey="id"
                                        bordered
                                        size="small"
                                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                                    />
                                </Skeleton>
                            </div>
                        </Card>
                        <Divider style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>DESCRIPTION DU TRAVAIL EFFECTUE</Divider>
                        <Card>
                            <div className="reparation_detail_top">
                                <Skeleton loading={loading} active paragraph={false}>
                                    <Table
                                        columns={columnsThree}
                                        dataSource={dataThree}
                                        onChange={(pagination) => setPagination(pagination)}
                                        pagination={pagination}
                                        rowKey="id"
                                        bordered
                                        size="small"
                                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                                    />
                                </Skeleton>
                            </div>
                        </Card>

                        <Divider style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>DÉTAIL DE RÉCLAMATION</Divider>
                        <Card>
                            <div className="reparation_detail_top">
                                <Skeleton loading={loading} active paragraph={false}>
                                    <Table
                                        columns={columnsFour}
                                        dataSource={dataFour}
                                        onChange={(pagination) => setPagination(pagination)}
                                        pagination={pagination}
                                        rowKey="id"
                                        bordered
                                        size="small"
                                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                                    />
                                </Skeleton>
                            </div>
                        </Card>
                    </div>
                </Card>
            </div>
            <Modal
                title=""
                visible={modalType === 'Add'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <SuiviReparationForm idReparations={idReparations} idReparation={idReparation} closeModal={() => setModalType(null)} fetchData={fetchData} />
            </Modal>

            <Modal
                title=""
                visible={modalType === 'Reclamation'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <ReclamationForm idReparations={idReparations} idReparation={idReparation} closeModal={() => setModalType(null)} fetchData={fetchData} />
            </Modal>
        </>
    );
};

export default ReparationDetail;
