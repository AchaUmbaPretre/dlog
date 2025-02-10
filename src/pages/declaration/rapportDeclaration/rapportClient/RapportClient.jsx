import React, { useEffect, useState } from 'react';
import { getClient } from '../../../../services/clientService';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Popconfirm, Popover, Space, Tooltip, Tag } from 'antd';
import { ExportOutlined,HomeOutlined,PlusCircleOutlined,MailOutlined,UserOutlined,PhoneOutlined,ApartmentOutlined, PrinterOutlined, PlusOutlined, TeamOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../../../config';

const RapportClient = () => {
      const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
      const [loading, setLoading] = useState(true);
      const [data, setData] = useState([]);
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
                    pagination={{ pageSize: 10 }}
                    rowKey="id"
                    bordered
                    size="middle"
                    scroll={scroll}
                />
            </div>
        </div>
    </>
  )
}

export default RapportClient