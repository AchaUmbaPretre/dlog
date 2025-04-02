import React, { useEffect, useState } from 'react';
import { Form, Col, Table, Input, Skeleton, Select, InputNumber, Button, DatePicker, Row, Divider, Card, notification } from 'antd';
import { getCatRapport, getContratRapport, getElementContrat, getParametreContratCat, postRapport } from '../../../services/rapportService';
import { useSelector } from 'react-redux';
import './rapportSpecialForm.scss'

const RapportSpecialForm = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 25,
          });
    const [isLoading, setIsLoading] = useState(false);
    const [contrat, setContrat] = useState([]);
    const [data, setData] = useState([]);
    const [params, setParams] = useState([]);
    const [idContrat, setIdContrat] = useState('');
    const [cat, setCat] = useState([]);
    const [idCat, setIdCat] = useState('');
    const [client, setClient] = useState([]);
    const [element, setElement] = useState([])
    const [idElement, setIdElement] = useState('')
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    
    const fetchDatas = async () => {
        try {
            const [ contratData, elementData, catData] = await Promise.all([
                getContratRapport(),
                getElementContrat(),
                getCatRapport()
            ]);

            setContrat(contratData.data)
            setElement(elementData.data)
            setCat(catData.data)

            if(idElement){
                const {data: ele} = await getParametreContratCat(idElement)
                setData(ele)
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

        useEffect(() => {
            fetchDatas();
              // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [idElement]);

        const handleChange = (value, key) => {
            setData(prevData =>
              prevData.map(item =>
                item.key === key ? { ...item, valeur: value } : item
              )
            );
          };

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
                width: "2%"      
            },
            {
              title: "Paramètre",
              dataIndex: "nom_parametre",
              key: "nom_parametre",
            },
            {
              title: "Valeur",
              dataIndex: "valeur",
              key: "valeur",
              render: (text, record) => (
                <Input
                  value={record.valeur}
                  onChange={(e) => handleChange(e.target.value, record.id_parametre)}
                />
              ),
            },
          ];

    
    return (
        <div className="rapportSpecialForm" >
            <div className="rapportSpecial_wrapper">
                <h1 className="h1_rapport">FORM DE RAPPORT</h1>
                <div className="rapportSpecial_rows">
                    <div className="rapportSpecial_row">
                        <div>
                            <Form.Item
                                name="id_contrat"
                                label="Contrat"
                                rules={[{ required: true, message: "Veuillez sélectionner un contrat" }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        showSearch
                                        options={contrat.map(item => ({ value: item.id_contrats_rapport , label: item.nom_contrat }))}
                                        placeholder="Sélectionnez..."
                                        onChange={setIdContrat}
                                        optionFilterProp="label"
                                    />
                                }
                            </Form.Item>
                        </div>

                        <div>
                            <Form.Item
                                name="id_cat_rapport"
                                label="Categorie"
                                rules={[{ required: true, message: "Veuillez sélectionner une categorie" }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        showSearch
                                        options={cat.map(item => ({ value: item.id_cat_rapport  , label: item.nom_cat }))}
                                        placeholder="Sélectionnez..."
                                        onChange={setIdCat}
                                        optionFilterProp="label"
                                    />
                                }
                            </Form.Item>
                        </div>

                        <div>
                            <Form.Item
                                name="id_element_contrat"
                                label="Element"
                                rules={[{ required: true, message: "Veuillez sélectionner un element" }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        showSearch
                                        options={element.map(item => ({ value: item.id_element_contrat ,label: item.nom_element }))}
                                        placeholder="Sélectionnez..."
                                        onChange={setIdElement}
                                        optionFilterProp="label"
                                    />
                                }
                            </Form.Item>
                        </div>
                    </div>

                    <div className="apportSpecial_row2">
                        <Table dataSource={data} columns={columns} pagination={false} bordered />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RapportSpecialForm;
