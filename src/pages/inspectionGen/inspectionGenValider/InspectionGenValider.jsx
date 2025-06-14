import { useEffect, useState } from 'react'
import { Table, Card, Button,  Skeleton } from 'antd';
import './inspectionGenValider.scss'
import { getInspectionValideAll, getSubInspection, postInspectionValide, putInspectionValide } from '../../../services/charroiService';
import { notification } from 'antd';
import { useSelector } from 'react-redux';
import { useMenu } from '../../../context/MenuProvider';

const InspectionGenValider = ({ closeModal, inspectionId, modelTypes }) => {
    const [data, setData] = useState([]);
    const scroll = { x: 400 };
    const [loading, setLoading] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedInspectionIds, setSelectedInspectionIds] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [manoeuvreData, setManoeuvreData] = useState({});
    const [budgetValide, setBudgetValide] = useState({});
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const { fetchDataInsp } = useMenu();

    const fetchDatas = async() => {
        try {
            const { data } = await getSubInspection(inspectionId);
            setData(data)


            if(modelTypes === 'updatedValider') {
              const { data : validationData } = await getInspectionValideAll(inspectionId);

              const manoeuvreInit = {};
              const budgetInit = {};

              validationData?.forEach(item => {
                manoeuvreInit[item.id_sub_inspection_gen] = item.manoeuvre || 0;
                budgetInit[item.id_sub_inspection_gen] = item.budget_valide || 0;
              });

              setManoeuvreData(manoeuvreInit);
              setBudgetValide(budgetInit);

              // Optionnel : précocher les lignes modifiées
              const selectedKeys = validationData.map(i => i.id_sub_inspection_gen);
              const selectedRows = data.filter(d => selectedKeys.includes(d.id_sub_inspection_gen));
              setSelectedRowKeys(selectedKeys);
              setSelectedInspectionIds(selectedKeys);
              setSelectedRows(selectedRows);
            }        

        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
            setLoading(false);
        } finally{
          setLoading(false)
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
                title: "Cout",
                dataIndex: 'montant',
                render : (text, record) => (
                  <div>
                    {text} $
                  </div>
                )
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
              title: "Budget",
              dataIndex: 'montant',
              render : (text, record) => (
                <div>
                  {text} $
                </div>
              )
            },
            {
              title: "Budget validé",
              dataIndex: 'budget_valide',
              render: (_, record) => (
                <input
                  type="number"
                  value={budgetValide[record.id_sub_inspection_gen] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBudgetValide(prev => ({
                      ...prev,
                      [record.id_sub_inspection_gen]: value
                    }));
                  }}
                  style={{ width: '100%', border:'none', border:'1px solid #f2f2f2a8', outline:'none', padding:'5px 9px' }}
                  placeholder="Saisir le budget validé"
                />
              )
            },
            {
              title: "Main-d'œuvre",
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
                  style={{ width: '100%', border:'none', border:'1px solid #f2f2f2a8', outline:'none', padding:'5px 9px' }}
                  placeholder="Saisir le prix de la main-d'œuvre"
                />
              )
            }
        ];

          
        const handleSubmitValidation = async () => {
          try {
            const payload = selectedRows.map((row) => ({
              id_sub_inspection_gen: row.id_sub_inspection_gen,
              id_type_reparation: row.id_type_reparation,
              id_cat_inspection: row.id_cat_inspection,
              montant: row.montant,
              budget_valide: budgetValide[row.id_sub_inspection_gen] || 0,
              manoeuvre: manoeuvreData[row.id_sub_inspection_gen] || 0,
              user_cr : userId 
            }));
        
            if ( modelTypes === 'updatedValider') {
              await putInspectionValide(payload);
              notification.success({
                message: 'Succès',
                description: 'Les validations ont été modifiées avec succès.',
              });
            } else {
              await postInspectionValide(payload);
              notification.success({
                message: 'Succès',
                description: 'Les réparations ont été validées avec succès.',
              });
              closeModal();
            }        
        
            // Reset
            setSelectedRowKeys([]);
            setSelectedRows([]);
            setManoeuvreData({});
            setBudgetValide({});
            fetchDatas();
            fetchDataInsp();
        
          } catch (error) {
            console.error('Erreur de validation:', error);
            
            const message =
              error?.response?.data?.error || 'Une erreur est survenue lors de la validation.';
        
            notification.error({
              message: 'Erreur',
              description: message,
            });
          }
        };
        
          

  return (
    <>
        <div className="inspectionGenValider">
            <div className="inspectionGenValider-wrapper">
                <Card title="Détails du véhicule" bordered={false} className="vehicule-info-card">
                  <Skeleton loading={loading} active paragraph={false}>
                      <div className="vehicule-details">
                          <div className="info-block">
                              <span className="label">IMMATRICULATION :</span>
                              <span className="value">{data[0]?.immatriculation || '-'}</span>
                          </div>
                          <div className="info-block">
                              <span className="label">MARQUE :</span>
                              <span className="value">{data[0]?.nom_marque || '-'}</span>
                          </div>
                          <div className="info-block">
                              <span className="label">DATE D'INSPECTION :</span>
                              <span className="value">
                                {data[0]?.date_inspection
                                  ? new Date(data[0].date_inspection).toLocaleDateString('fr-FR')
                                  : '-'}
                              </span>

                          </div>
                      </div>
                  </Skeleton>
                </Card>

                <Card>
                  <Skeleton loading={loading} active>
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
                  </Skeleton>
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
                      { modelTypes === 'updatedValider' ? 'Modifier les réparations' : 'Valider les réparations'}
                    </Button>

                </Card>
                }
            </div>
        </div>
    </>
  )
}

export default InspectionGenValider