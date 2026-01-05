import React, { useEffect, useState } from 'react'
import { getRepGenerateurOne } from '../../../../../services/generateurService';
import { Card, Button, Tooltip, Space, notification, Tag, Skeleton, Table, Modal } from 'antd';
import moment from 'moment';
import { evaluationStatusMap, statutIcons } from '../../../../../utils/prioriteIcons';
import { EyeOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import ReparationGeneratTracking from './reparationGeneratTracking/ReparationGeneratTracking';

const ReparationGeneratDetail = ({idRepgen}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 20,
  });
  const [modele, setModele] = useState('');
  const [details, setDetails] = useState('');
  const [desc , setDesc] = useState('');
  const scroll = { x: 'max-content' };
  const [modal, setModal] = useState({ type: null, id: null });

    const openModal = (type, id = null) => setModal({ type, id });
    const closeAllModals = () => setModal({ type: null, id: null });

    useEffect(() => {
      setLoading(true)
      const fetchData = async() => {
        try {
          const res = await getRepGenerateurOne(idRepgen)
          setData(res?.data?.sqlInfo);
          setDetails(res?.data?.sqlDetail);
          setDesc(res?.data?.sqlDesc);
          setModele(res?.data.sqlInfo[0].nom_modele)

        } catch (error) {
          notification.error({
            message : "Erreur de changement",
            description : "Impossible de récupérer les données des réparations",
            placement: "topRight"
          })
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }, [idRepgen]);

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
                              aria-label="Voir les détails"
                              style={{ color: 'blue' }}
                              onClick={() => openModal('suivi', record.id_sub_reparations_generateur) }
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

  return (
    <>
      <div className="reparation_detail">
        <div className="reparation_detail_title">
          <h1 className="reparation_detail_h1">SUIVI D'INTERVENTION : {modele}</h1>
        </div>
        <Card>
          <div className="reparation_detail_wrapper">
            <Card type="inner" title="INFORMATIONS GENERALES"  className='reparation_detail_card'>
              <div className="reparation_detail_top">
                <Skeleton loading={loading} active paragraph={false}>
                  <Table
                    columns={columns}
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
            <Card type="inner" title="DETAIL DES REPARATIONS"  className='reparation_detail_card'>
              <div className="reparation_detail_top">
                <Skeleton loading={loading} active paragraph={false}>
                  <Table
                    columns={columnsTwo}
                    dataSource={details}
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

            <Card type="inner" title="DESCRIPTION DU TRAVAIL EFFECTUE"  className='reparation_detail_card'>
              <div className="reparation_detail_top">
                <Skeleton loading={loading} active paragraph={false}>
                  <Table
                    columns={columnsThree}
                    dataSource={desc}
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

          </div>

        </Card>

      </div>
      <Modal
        open={modal.type === "suivi"}
        onCancel={closeAllModals}
        footer={null}
        width={1020}
        centered
        destroyOnClose
      >
        <ReparationGeneratTracking idRep={modal.id} />
      </Modal>
    </>
  )
}

export default ReparationGeneratDetail