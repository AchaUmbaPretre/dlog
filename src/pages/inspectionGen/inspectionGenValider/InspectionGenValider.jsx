import React, { useEffect, useState } from 'react'
import { Table, Card } from 'antd';
import './inspectionGenValider.scss'
import { getSubInspection } from '../../../services/charroiService';
import { notification } from 'antd';

const InspectionGenValider = ({ closeModal, fetchData, inspectionId }) => {
    const [data, setData] = useState([]);
    const scroll = { x: 400 };
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedInspectionIds, setSelectedInspectionIds] = useState([]);

    const fetchDatas = async() => {
        try {
            const { data } = await getSubInspection(inspectionId);
            setData(data)

        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
            setLoading(false);
        }
    }

    useEffect(()=> {
        fetchDatas()
    }, [inspectionId])

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedInspectionIds(newSelectedRowKeys);
      };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
      };

        const columns = [
            { 
                title: '#', 
                dataIndex: 'id', 
                key: 'id', 
                render: (text, record, index) => index + 1, 
                width: "3%" 
            },       
            {
                title: 'Type de réparation',
                dataIndex: 'type_rep',
            },
            {
                title: "Categorie d'inspection",
                dataIndex: 'nom_cat_inspection',
            },
            {
                title: "Etat",
                dataIndex: 'nom_carateristique_rep',
            },
            {
                title: "Cout",
                dataIndex: 'montant',
            }
        ]


  return (
    <>
        <div className="inspectionGenValider">
            <div className="inspectionGenValider-wrapper">
                <Card title="Détails du véhicule" bordered={false} className="vehicule-info-card">
                    <div className="vehicule-details">
                        <div className="info-block">
                            <span className="label">Immatriculation :</span>
                            <span className="value">{data[0]?.immatriculation || '-'}</span>
                        </div>
                        <div className="info-block">
                            <span className="label">Marque :</span>
                            <span className="value">{data[0]?.nom_marque || '-'}</span>
                        </div>
                        <div className="info-block">
                            <span className="label">Date d'inspection :</span>
                            <span className="value">
                            {data[0]?.date_inspection
                            ? new Date(data[0].date_inspection).toLocaleDateString()
                            : '-'}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <Table
                        columns={columns}
                        rowSelection={rowSelection}
                        dataSource={data}
                        rowKey="id_sub_inspection_gen"
                        loading={loading}
                        scroll={scroll}
                        size="small"
                        bordered
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    />
                </Card>

                <Card title="Réparation">
                    <Table
                        columns={columns}
                        rowKey="id_sub_inspection_gen"
                        loading={loading}
                        scroll={scroll}
                        size="small"
                        bordered
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    />
                </Card>
            </div>
        </div>
    </>
  )
}

export default InspectionGenValider