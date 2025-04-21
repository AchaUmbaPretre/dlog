import React, { useEffect, useState } from 'react';
import './suiviReparationForm.scss'
import { Card, Skeleton, Divider, Table, Tag } from 'antd';
import moment from 'moment';


const SuiviReparationForm = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });
    const [evalue, setEvalue] = useState('')

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
    
  return (
    <>
        <div className="suivi_reparation_form">
            <div className="reparation_detail_title">
                <h1 className="reparation_detail_h1">SUIVI INTERVENTION BON N° 7: VEHECULE N°ISUZU D-MAX 4675AA/19</h1>
            </div>
            <div className="suivi_reparation_wrapper">
                <Divider style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>INFORMATIONS GENERALES</Divider>
                <Card>
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
                                rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                            />
                        </Skeleton>
                    </div>
                </Card>
                <Card>
                    <div className="reparation_detail_top">
                        <Skeleton loading={loading} active paragraph={false}>
                        </Skeleton>
                    </div>
                </Card>
                <Card>
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
                                rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                            />
                        </Skeleton>
                    </div>
                </Card>
            </div>
        </div>
    </>
  )
}

export default SuiviReparationForm