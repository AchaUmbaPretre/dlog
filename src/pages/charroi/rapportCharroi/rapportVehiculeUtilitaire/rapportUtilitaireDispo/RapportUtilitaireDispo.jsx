import { Table, Tag, Tooltip, Space, Typography, Skeleton } from 'antd';
import { CarOutlined, TruckOutlined, CalendarOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './rapportUtilitaireDispo.scss';

const { Text } = Typography;

const RapportUtilitaireDispo = ({ data }) => {
    const [loading, setLoading] = useState(false);

    const columns = [
        { 
            title: '#', 
            key: 'index', 
            render: (_, __, index) => (
                <Tooltip title={`Ligne ${index + 1}`}>
                    <Tag color="blue">{index + 1}</Tag>
                </Tooltip>
            ),
            width: "5%",
            align: "center"
        },
        {
            title: 'Matricule',
            dataIndex: 'immatriculation',
            key: 'immatriculation',
            render: (text) => (
                <div className="vehicule-matricule">
                    <span className="car-wrapper">
                        <span className="car-boost" />
                        <CarOutlined className="car-icon-animated" />
                        <span className="car-shadow" />
                    </span>
                    <Tag color="geekblue" style={{ fontWeight: 600 }}>{text}</Tag>
                </div>
            ),
            width: "20%"
        }, 
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
            key: 'nom_marque',
            render: (text) => (
                <Tag icon={<CarOutlined />} color="cyan" style={{ fontWeight: 600 }}>
                    {text}
                </Tag>
            ),
            width: "20%"
        },
        {
            title: 'Type véhicule',
            dataIndex: 'nom_cat',
            key: 'nom_cat',
            render: (text) => (
                <Tag icon={<TruckOutlined />} color="geekblue" style={{ fontWeight: 600 }}>
                    {text ?? 'Aucun'}
                </Tag>
            ),
            width: "25%"
        },
        {
            title: 'Statut',
            dataIndex: 'statut_affichage',
            key: 'statut_affichage',
            render: (text) => {
                let color = text.includes('Disponible') ? 'green' : 'orange';
                return (
                    <Tooltip title={`Statut du véhicule: ${text}`}>
                        <Tag color={color} style={{ fontWeight: 600 }}>{text}</Tag>
                    </Tooltip>
                );
            },
            width: "20%"
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            render: (text) => (
                <Tag color="geekblue" style={{ fontWeight: 600 }}>{text ?? 'Aucun'}</Tag>
            ),
            width: "10%",
            align: "center"
        }
    ];

    return (
        <div className="rapportUtilitaire_dispo" style={{ padding: 20, background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div className="rapport_utilitaire_dispo_wrapper">
                {loading ? <Skeleton active /> : (
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id_vehicule"
                        rowClassName={(record, index) => index % 2 === 0 ? 'odd-row' : 'even-row'}
                        bordered
                        size="middle"
                        pagination={{ pageSize: 5 }}
                    />
                )}
            </div>
        </div>
    )
}

export default RapportUtilitaireDispo;
