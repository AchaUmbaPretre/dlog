import React, { useEffect, useState } from 'react'
import { Table, Card, Button } from 'antd';
import './inspectionGenValider.scss'
import { getSubInspection, postInspectionValide } from '../../../services/charroiService';
import { notification } from 'antd';

const InspectionGenValider = ({ closeModal, fetchData, inspectionId }) => {
    const [data, setData] = useState([]);
    const scroll = { x: 400 };
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedInspectionIds, setSelectedInspectionIds] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [manoeuvreData, setManoeuvreData] = useState({});

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

    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedInspectionIds(newSelectedRowKeys);
        setSelectedRows(selectedRows);
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

    const selectedColumns = [
            {
              title: '#',
              render: (text, record, index) => index + 1,
              width: "5%"
            },
            {
              title: 'Type de réparation',
              dataIndex: 'type_rep',
            },
            {
              title: "Catégorie d'inspection",
              dataIndex: 'nom_cat_inspection',
            },
            {
              title: "État",
              dataIndex: 'nom_carateristique_rep',
            },
            {
              title: "Cout",
              dataIndex: 'montant',
            },
            {
              title: "Manœuvre",
              dataIndex: 'manoeuvre',
              render: (_, record) => (
                <input
                  type="number"
                  value={manoeuvreData[record.id_sub_inspection_gen] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setManoeuvreData(prev => ({
                      ...prev,
                      [record.id_sub_inspection_gen]: value
                    }));
                  }}
                  style={{ width: '100%' }}
                  placeholder="Saisir le prix de la manœuvre"
                />
              )
            }
        ];
          
        console.log(selectedRows)
        const handleSubmitValidation = async () => {
            try {
              const payload = selectedRows.map((row) => ({
                id_sub_inspection_gen: row.id_sub_inspection_gen,
                id_type_reparation : row.id_type_reparation,
                id_cat_inspection: row.id_cat_inspection,
                id_carateristique_rep: row.id_carateristique_rep,
                montant: row.montant,
                manoeuvre: manoeuvreData[row.id_sub_inspection_gen] || 0,
              }));
          
                // Envoi vers ton service (ajoute cette méthode dans ton service API)
              await postInspectionValide(payload);         
              notification.success({
                message: 'Succès',
                description: 'Les réparations ont été validées avec succès.',
              });
          
              // Optionnel : reset
              setSelectedRowKeys([]);
              setSelectedRows([]);
              setManoeuvreData({});
              fetchDatas();
              fetchData();
              closeModal();
          
            } catch (error) {
              console.error('Erreur de validation:', error);
              notification.error({
                message: 'Erreur',
                description: 'Une erreur est survenue lors de la validation.',
              });
            }
          };
          

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
                {  selectedRows.length > 0 && 
                <Card title="Réparation sélectionnée" style={{marginTop:'10px'}}>
                    <Table
                        columns={selectedColumns}
                        dataSource={selectedRows}
                        rowKey="id_sub_inspection_gen"
                        size="small"
                        bordered
                        pagination={false}
                        scroll={scroll}
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    />
                    <Button
                        style={{marginTop:'10px'}}
                        type="primary"
                        onClick={handleSubmitValidation}
                        disabled={selectedRows.length === 0}
                    >
                        Valider les réparations
                    </Button>

                </Card>
                }
            </div>
        </div>
    </>
  )
}

export default InspectionGenValider