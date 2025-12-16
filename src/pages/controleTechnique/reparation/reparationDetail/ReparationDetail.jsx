import { useEffect, useState } from 'react';
import { Card, Button, Skeleton, Tooltip, Menu, Dropdown, Modal, Divider, Space, Table, notification, Tag } from 'antd';
import { EyeOutlined, ToolOutlined, FileTextOutlined, UserOutlined, MoreOutlined } from '@ant-design/icons';
import { getReclamation, getReparationImage, getReparationOne, getSuiviReparation } from '../../../../services/charroiService';
import moment from 'moment';
import './reparationDetail.scss'
import { evaluationStatusMap, statutIcons } from '../../../../utils/prioriteIcons';
import SuiviReparationForm from '../suiviReparation/suiviReparationForm/SuiviReparationForm';
import ReclamationForm from '../reclamationForm/ReclamationForm';
import config from '../../../../config';
import TravailEffectue from '../travailEffectue/TravailEffectue';

const ReparationDetail = ({ idReparation, inspectionId }) => {
    const [data, setData] = useState(null);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
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
    const [resImg, setResImg] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const scroll = { x: 'max-content' };

    const handleSuivi = (id) => {
        openModal('tracking', id);
    }

    const handleEdit = (id) => {
        openModal('modify', id);
    }

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type, id='') => {
        closeAllModals();
        setModalType(type);
        setIdReparations(id)
    };

    const handleDetails = (id) => openModal('Add', id);

    const getActionMenu = (record, openModal) => {
        const handleClick = ({ key }) => {
          switch (key) {
            case 'voirDetail':
                openModal('Detail', record.id_sub_reclamation)
              break;
            case 'suivi':
              openModal('SuiviRecl', record.id_sub_reclamation);
              break;
            default:
              break;
          }
        };
      
        return (
          <Menu onClick={handleClick}>
            <Menu.Item key="voirDetail">
              <EyeOutlined style={{ color: 'green' }} /> Voir Détail
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="suivi">
              <FileTextOutlined style={{ color: 'blue' }} /> Faire suivi
            </Menu.Item>
            <Menu.Divider />
          </Menu>
        );
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getReparationOne(idReparation, inspectionId);
            const res = await getSuiviReparation(idReparation, inspectionId);
            const resImg = await getReparationImage(idReparation, inspectionId);
            const reclam = await getReclamation(idReparation, inspectionId)

            setDataThree(res?.data);
            setData(response?.data?.data);
            setDetail([response?.data?.dataGen[0]]);
            setResImg(resImg.data)
            setDataFour(reclam?.data)

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
        if (idReparation || inspectionId) {
            fetchData();
        }
    }, [idReparation, inspectionId]);

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
            {   title: 'Date début', 
                dataIndex: 'date_entree', 
                key: 'date_entree', 
                render: (text) => 
                <Tag color='purple'>{moment(text).format('LL')}</Tag> 
            },
            {   title: 'Date fin', 
                dataIndex: '"date_sortie', 
                key: '"date_sortie', 
                render: (text) => {
                    if (!text || !moment(text).isValid()) {
                        return <Tag color="default">Aucune date</Tag>;
                    }
                    return <Tag color='purple'>{moment(text).format('LL')}</Tag>;
                }
            },
            {   title: 'Fournisseur', 
                dataIndex: 'nom_fournisseur', 
                key: 'fournisseur', 
                render: (text) => <Tag color="blue">{text}</Tag> 
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
                render: (text) => {
                  const isEmpty = !text || text.trim() === '';
                  
                  if (isEmpty) {
                    return (
                        <Tooltip title="Aucun statut n’a été attribué pour cette évaluation.">
                            <Tag color="default">
                                Aucun statut
                            </Tag>
                        </Tooltip>
                    );
                  }
                  const { color = 'default', icon = null } = evaluationStatusMap[text] || {};
                  return (
                    <Tag icon={icon} color={color}>
                      {text}
                    </Tag>
                  );
                },
            },              
            { 
                title: 'Statut final', 
                dataIndex: 'nom_type_statut', 
                key: 'nom_type_statut',
                render: text => {
                    const { icon, color } = statutIcons(text);
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
                render: (_, record) => (
                    <>
                        <Tooltip title="Faire un suivi">
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() => {handleDetails(record.id_sud_reparation); setSelectedRecord(record)}}
                                aria-label="Voir les détails"
                                style={{ color: 'blue' }}
                            />
                        </Tooltip>
                    </>
                )
            },
/*             {
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
            } */
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
        {   title: 'Réclamation:', 
            dataIndex: 'type_rep', 
            key: 'type_rep', 
            render: (text) => 
            <Tag color='blue'>{text}</Tag>
        },
        {   title: 'Motif', 
            dataIndex: 'raison_fin', 
            key: 'raison_fin', 
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
        {
            title: 'Date fin.',
            dataIndex: 'date_fin',
            key: 'date_fin',
            render: (text) =>
                text ? (
                    <Tag color='purple'>{moment(text).format('LL')}</Tag>
                ) : (
                    <Tag color='default'>Aucune date</Tag>
                ),
        },        
        {
            title: 'Statut',
            dataIndex: 'nom_evaluation',
            key: 'nom_evaluation',
            render: (text) => {
              const { color, icon } = evaluationStatusMap[text] || { color: 'default' };
              return <Tag icon={icon} color={color}>{text}</Tag>;
            },
        },
        {   title: 'Budget', 
            dataIndex: 'cout', 
            key: 'cout', 
            render: (text) => <Tag color="green">{text} $</Tag> 
        },
        {   title: 'Créer par', 
            dataIndex: 'nom', 
            key: 'nom',
            render: (text) => <Tag icon={<UserOutlined />} color="blue">{text}</Tag> 
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => {
              return (
                <Space>
                  <Dropdown overlay={getActionMenu(record, openModal)} trigger={['click']}>
                    <Button icon={<MoreOutlined />} style={{ color: 'blue' }} />
                  </Dropdown>
                </Space>
              );
            }
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
                        <Divider orientation="left" orientationMargin="0"  style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>INFORMATIONS GENERALES</Divider>
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
                                        scroll={scroll}
                                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                                    />
                                </Skeleton>
                            </div>
                        </Card>
                        <Divider orientation="left" orientationMargin="0" style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>DETAIL DES REPARATIONS</Divider>
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
                                        scroll={scroll}
                                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                                    />
                                </Skeleton>
                            </div>
                        </Card>
                        <Divider orientation="left" orientationMargin="0"  style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>DESCRIPTION DU TRAVAIL EFFECTUE</Divider>
                        <Card className='reparation_detail_card'>
                            <div className="reparation_detail_top">
                                <Skeleton loading={loading} active paragraph={false}>
                                    <Table
                                        columns={columnsThree}
                                        dataSource={dataThree}
                                        onChange={(pagination) => setPagination(pagination)}
                                        pagination={pagination}
                                        rowKey="id"
                                        bordered
                                        scroll={scroll}
                                        size="small"
                                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                                    />
                                </Skeleton>
                            </div>
                        </Card>
                        { dataFour?.length >= 1 && (
                            <> 
                            <Divider orientation="left" orientationMargin="0"  style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>DÉTAIL DE RÉCLAMATION</Divider>
                            <Card className='reparation_detail_card'>
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
                                            scroll={scroll}
                                            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                                        />
                                    </Skeleton>
                                </div>
                            </Card>
                            </>
                        )}

                        { resImg?.length >= 1 &&(
                            <>
                            <Divider style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>Comparatif visuel : Avant et Après Réparation</Divider>
                            <Card className='reparation_detail_card'>
                                <div className="reparation_detail_top">
                                    <div className="reparation_wrapper_img">
                                    { resImg.map((d) => (
                                        <Card>
                                            <div className="reparation_detail_img_rows">
                                                <div className="reparation_img">
                                                    <img src={`${DOMAIN}/${d.image}`} alt="" className="img" />
                                                </div>
                                                <div className="reparation_img_row">
                                                    <span className="reparation_span">Type : <strong>{d?.nom_type_photo}</strong></span>
                                                    <span className="reparation_span">Commentaire : <strong>{d?.commentaire}</strong></span>
                                                    <span className="reparation_span">Date : <strong> {moment(d?.created_at).format('LL')}</strong></span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    </div>
                                </div>
                            </Card>
                            </>
                        )}
                    </div>
                </Card>
            </div>

             <Modal
                title=""
                visible={modalType === 'tracking'}
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

            <Modal
                open={modalType === 'Add'}
                onCancel={closeAllModals}
                footer={null}
                width={400}
                centered
                closable={false}
                bodyStyle={{
                    padding: '32px',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ marginBottom: 24 }}>Que souhaitez-vous faire ?</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Button type="primary" onClick={() => handleSuivi(selectedRecord.id_sud_reparation)}>
                        Faire un suivi
                    </Button>
                    <Button onClick={() => handleEdit(selectedRecord.id_sud_reparation)}>
                        Modifier le travail déjà effectué
                    </Button>
                    <Button type="text" onClick={closeAllModals} style={{ marginTop: 12, color: '#999' }}>
                        Annuler
                    </Button>
                </div>
            </Modal>

            <Modal
                title=""
                visible={modalType === 'modify'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <TravailEffectue idReparations={idReparations} idReparation={idReparation} closeModal={() => setModalType(null)} fetchData={fetchData} />
            </Modal>
        </>
    );
};

export default ReparationDetail;
