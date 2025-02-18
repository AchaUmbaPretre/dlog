import React, { useEffect, useRef, useState } from 'react';
import { getClient, getClientResume } from '../../../../services/clientService';
import { Table, notification,Tag, Modal, Tooltip, Skeleton } from 'antd';
import { MailOutlined,UserOutlined } from '@ant-design/icons';
import config from '../../../../config';
import DeclarationOneAll from '../../declarationOneAll/DeclarationOneAll';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';

const RapportClient = () => {
      const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
      const [searchText, setSearchText] = useState('');
      const [searchedColumn, setSearchedColumn] = useState('')
      const [loading, setLoading] = useState(true);
      const [data, setData] = useState([]);
      const [modalType, setModalType] = useState(null);
      const [idClient, setidClient] = useState('');
      const searchInput = useRef(null);
      const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
      const [detail, setDetail] = useState([]);
    
      const scroll = { x: 400 };

      const handleDeclarationOneAll = (idClient) => {
        openModal('OneAll', idClient );
      };

      const closeAllModals = () => {
        setModalType(null);
      };

      const openModal = ( type, idClient='' ) => {
        closeAllModals();
        setModalType(type);
        setidClient(idClient)
      };

      const columns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          render: (text, record, index) => index + 1,
          width: "3%",
        },
        {
          title: 'Nom',
          dataIndex: 'nom',
          key: 'nom',
          ...getColumnSearchProps(
            'nom',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
          ),
          render: (text, record) => (
            <Tooltip title="Voir les détails des déclarations">
                <Tag icon={<UserOutlined />} color="blue" onClick={() => handleDeclarationOneAll(record.id_client)}>{text ?? 'Aucun'}</Tag>
            </Tooltip>
          ),
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          render: (text) => (
            <Tag icon={<MailOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
          ),
        },
        {
          title: 'Type',
          dataIndex: 'nom_type',
          key: 'nom_type',
          render: (text) => (
            <Tag color={ text === 'Interne' ? 'green' : "magenta"}>{text}</Tag>
          ),
        }
      ]

    const fetchData = async () => {
        try {
          const [ clientData, detailData] = await Promise.all([
            getClient(),
            getClientResume()
          ])
          
          setData(clientData.data);
          setDetail(detailData.data)
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
    }, [DOMAIN]);

  return (
    <>
                {
            loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
                <div
                  style={{
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      width: 'fit-content',
                      margin: '20px 0',
                      padding: '15px',
                  }}
                >
                    <span
                        style={{
                        display: 'block',
                        padding: '10px 15px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        borderBottom: '1px solid #f0f0f0',
                        }}
                    >
                        Résumé :
                    </span>
                <div
                    style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '15px',
                    padding: '15px',
                    }}
                >
                    <span
                        style={{
                        fontSize: '0.9rem',
                        fontWeight: '400',
                        cursor: 'pointer',
                        color: '#1890ff',
                        }}
                    >
                      Nbre de client : <strong>{detail?.nbre_batiment}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    M² facturé :{' '}
                    <strong>{Math.round(parseFloat(detail.total_facture))?.toLocaleString()}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    M² Occupé :{' '}
                    <strong>{Math.round(parseFloat(detail.total_occupe))?.toLocaleString()}</strong>
                    </span>
                </div>
                </div>
            )
        }
        <div className="rapport_facture">
            <div className="rapport_wrapper_facture">
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                      ...pagination,
                      onChange: (current, pageSize) => setPagination({ current, pageSize }),
                    }}
                    rowKey="id"
                    bordered
                    size="middle"
                    scroll={scroll}
                />
            </div>
            <Modal
              title=""
              visible={modalType === 'OneAll'}
              onCancel={closeAllModals}
              footer={null}
              width={1250}
              centered
            >
              <DeclarationOneAll idClients={idClient} />
          </Modal>
        </div>
    </>
  )
}

export default RapportClient