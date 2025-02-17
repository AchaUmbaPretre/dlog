import React, { useEffect, useRef, useState } from 'react';
import { getClient } from '../../../../services/clientService';
import { Table, notification,Tag, Modal, Tooltip } from 'antd';
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