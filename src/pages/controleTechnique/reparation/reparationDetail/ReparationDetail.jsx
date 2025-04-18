import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Table, notification, Typography, Tag } from 'antd';
import { getReparationOne } from '../../../../services/charroiService';
import moment from 'moment';
import './reparationDetail.scss'

const { Title } = Typography;

const ReparationDetail = ({ idReparation }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
      });

    const fetchDatas = async () => {
        setLoading(true);
        try {
            const response = await getReparationOne(idReparation);
            setData(response.data.data);
            setDetail(response.data.dataGen)
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
            fetchDatas();
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
            {   title: 'Matricule', 
                dataIndex: 'immatriculation', 
                key: 'immatriculation', 
                render: (text) => <Tag color="blue">{text}</Tag> 
            },
            {   title: 'Marque', 
                dataIndex: 'nom_marque', 
                key: 'nom_marque', 
                render: (text) => <Tag color="blue">{text}</Tag> 
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
                render: (text) => 
                <Tag color='purple'>{moment(text).format('LL')}</Tag> 
            },
            {   title: 'Fournisseur', 
                dataIndex: 'nom_fournisseur', 
                key: 'fournisseur', 
                render: (text) => <Tag color="blue">{text}</Tag> 
            },
            {   title: 'Cout', 
                dataIndex: 'cout', 
                key: 'cout', 
                render: (text) => <Tag color="blue">{text} $</Tag> 
            }
          
    ]


    return (
        <>
            <div className="reparation_detail">
                <div className="reparation_detail_wrapper">
                    <div className="reparation_detail_top">
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReparationDetail;
