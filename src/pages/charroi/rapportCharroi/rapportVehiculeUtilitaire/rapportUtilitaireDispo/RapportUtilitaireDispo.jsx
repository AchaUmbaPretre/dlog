import { Table, Button, Image, Tabs, Input, message, Dropdown, Menu, Space, Tooltip, Popconfirm, Tag, Modal, notification } from 'antd';
import { ExportOutlined, CarOutlined, DeleteOutlined, EyeOutlined, TruckOutlined, CalendarOutlined, PrinterOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import './rapportUtilitaireDispo.scss'
import { useState } from 'react';

const RapportUtilitaireDispo = ({data}) => {
  const [loading, setLoading] = useState(false);

    const columns = [
        { 
        title: '#', 
        dataIndex: 'id', 
        key: 'id', 
        render: (text, record, index) => (
            <Tooltip title={`Ligne ${index + 1}`}>
            <Tag color="blue">{index + 1}</Tag>
            </Tooltip>
        ),
        width: "4%" 
        },
        {
            title: 'Matricule',
            dataIndex: 'immatriculation',
            render: (text) => (
                <div className="vehicule-matricule">
                    <span className="car-wrapper">
                        <span className="car-boost" />
                            <CarOutlined className="car-icon-animated" />
                        <span className="car-shadow" />
                    </span>
                    <Tag color="geekblue">{text}</Tag>
                </div>
            )
        }, 
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
                render: (text, record) => (
                    <Tag icon={<CarOutlined />} color="cyan">
                        {text}
                    </Tag>
                )
        },
        {
        title: 'Modèle',
        dataIndex: 'modele',
        render : (text) => (
            <Tag icon={<CarOutlined />} color="green">
                {text ?? 'Aucun'}
            </Tag>
        )

        },
        {
            title: 'Type véhicule',
            dataIndex: 'nom_cat',
            render : (text) => (
            <Tag icon={<CarOutlined />} color="geekblue">
                {text ?? 'Aucun'}
            </Tag>
            )
        }
    ];

  return (
    <>
        <div className="rapportUtilitaire_dispo">
            <h2 className="rapport_h2">Véhicules disponibles</h2>
            <div className="rapport_utilitaire_dispo_wrapper">
                <Table
                  columns={columns}
                  dataSource={data}
                  rowKey="id_vehicule"
                  rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  bordered
                  size="small" 
                  loading={loading}
                />
            </div>
        </div>
    </>
  )
}

export default RapportUtilitaireDispo