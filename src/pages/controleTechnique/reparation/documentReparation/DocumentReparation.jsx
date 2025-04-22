import React, { useState } from 'react'
import './documentReparation.scss'
import { Card, Button, Table, Popconfirm, Space, Tooltip, Tag } from 'antd';
import { FileTextOutlined, DeleteOutlined,EditOutlined, DownloadOutlined } from '@ant-design/icons';
import config from '../../../../config';
import { getTagProps } from '../../../../utils/prioriteIcons';

const DocumentReparation = () => {
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 15,
        });
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
              title: 'Nom doc',
              dataIndex: 'nom_document',
              key: 'nom_document',
              render: (text) => (
                <Tag icon={<FileTextOutlined />} color="green">{text}</Tag>
              ),
            },
            {
              title: 'Type',
              dataIndex: 'type_document',
              key: 'type_document',
              render: (text) => {
                const { icon, color } = getTagProps(text);
                return <Tag icon={icon} color={color}>{text}</Tag>;
              },
            },
            {
              title: 'Doc',
              dataIndex: 'chemin_document',
              key: 'chemin_document',
              render: (text) => (
                <a href={`${DOMAIN}/${text}`} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<DownloadOutlined />} color="blue">Télécharger</Tag>
                </a>
              ),
            },
/*             {
              title: 'Action',
              key: 'action',
              width: '10%',
              render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Modifier">
                    <Button
                      icon={<EditOutlined />}
                      style={{ color: 'green' }}
                      onClick={() => handleViewDetails(record.id_tache_document )}
                      aria-label=""
                    />
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <Popconfirm
                      title="Êtes-vous sûr de vouloir supprimer ce client?"
                      onConfirm={() => handleDelete(record.id)}
                      okText="Oui"
                      cancelText="Non"
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        style={{ color: 'red' }}
                        aria-label="Delete client"
                      />
                    </Popconfirm>
                  </Tooltip>
                </Space>
              ),
            }, */
          ];


  return (
    <>
        <div className="document_reparation">
            <div className="document_reparation_wrapper">
                
                <div className="document_reparation_left">
                    <Card>

                    </Card>
                </div>

                <div className="document_reparation_right">
                    <Card>
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
                    </Card>
                </div>
                
            </div>
        </div>

    </>
  )
}

export default DocumentReparation