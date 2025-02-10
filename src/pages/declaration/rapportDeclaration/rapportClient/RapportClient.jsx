import React, { useEffect, useState } from 'react';
import { getClient } from '../../../../services/clientService';
import { Table, notification,Tag, Modal } from 'antd';
import { HomeOutlined,MailOutlined,UserOutlined } from '@ant-design/icons';
import config from '../../../../config';

const RapportClient = () => {
      const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
      const [loading, setLoading] = useState(true);
      const [data, setData] = useState([]);
      const [modalType, setModalType] = useState(null);
      const [idClient, setidClient] = useState('');
      
      const scroll = { x: 400 };

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
          render: (text) => (
            <Tag icon={<UserOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
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
          title: 'Adresse',
          dataIndex: 'adresse',
          key: 'adresse',
          render: (text) => (
            <> 
              <Tag icon={<HomeOutlined />} color='cyan'>
                {text ?? 'Aucune'}
              </Tag>
            </>
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

      const closeAllModals = () => {
        setModalType(null);
      };

    const fetchData = async () => {
        try {
          const { data } = await getClient();
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
  
    useEffect(() => {
      fetchData();
    }, [DOMAIN]);

  return (
    <>
        <div className="rapport_facture">
            <div className="rapport_wrapper_facture">
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{ pageSize: 15 }}
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