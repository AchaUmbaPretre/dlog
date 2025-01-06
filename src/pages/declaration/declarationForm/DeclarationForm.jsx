import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, DatePicker, Collapse, notification } from 'antd';
import './declarationForm.scss';
import { getDeclarationOne, getObjetFacture, getTemplate, getTemplateOne, postDeclaration, putDeclaration } from '../../../services/templateService';
import { getClient, getProvince } from '../../../services/clientService';
import { getBatiment } from '../../../services/typeService';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import DeclarationOneClient from '../declarationOneClient/DeclarationOneClient';

const { Option } = Select;
const { Panel } = Collapse;

const DeclarationForm = ({closeModal, fetchData, idDeclaration}) => {
    const [form] = Form.useForm();
    const [templates, setTemplates] = useState([]);
    const [idTemplate, setIdTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [objet, setObjet] = useState([]);
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const navigate = useNavigate();
    const [idClient, setIdClient] = useState('');
    const [idDeclarations, setIdDeclarations] = useState(idDeclaration);
    const [periode, setPeriode] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // Clé de rafraîchissement


    useEffect(() => {
        setIdDeclarations(idDeclaration);
    }, [idDeclaration]);

    const fetchDataAll = async () => {
        try {
            const [ templateData, objetData, provinceData, clientData, batimentData] = await Promise.all([
                getTemplate(),
                getObjetFacture(),
                getProvince(),
                getClient(),
                getBatiment()
            ])
            setTemplates(templateData.data);
            setObjet(objetData.data);
            setProvince(provinceData.data);
            setClient(clientData.data);
            setBatiment(batimentData.data)

            if(idDeclaration) {
                const { data : declaration } = await getDeclarationOne(idDeclaration)
                if( declaration && declaration[0]){
                    form.setFieldsValue({
                        ...declaration[0],
                        periode : moment(declaration[0].periode, 'YYYY-MM-DD')
                    })
                }
            }

            if(idDeclarations) {
                const { data : declaration } = await getDeclarationOne(idDeclarations)
                if( declaration && declaration[0]){
                    form.setFieldsValue({
                        ...declaration[0],
                        id_ville: declaration[0].id_ville,
                        id_client: declaration[0].id_client,
                        periode : moment(declaration[0].periode, 'YYYY-MM-DD')
                    })
                }
            }
            

        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        }
    };

    useEffect(() => {
        fetchDataAll()
    }, [idClient, idDeclarations]);

    const handleTemplateChange = async () => {
        try {
            const { data} = await getTemplateOne(idTemplate);
            const { id_ville, id_client} = data[0];
        
            form.setFieldsValue({
                id_ville,
                id_client
            });

            setIdClient(id_client)
        } catch (error) {
            console.log(error)
        }
    };
    
    useEffect(() => {
        handleTemplateChange()
    }, [idTemplate]);


    const onFinish = async (values) => {
        setIsLoading(true);

        try {
            if(idDeclaration) {
                await putDeclaration(idDeclaration, values)
            }
            else{
                await postDeclaration(values);
                setRefreshKey((prev) => prev + 1);
            }
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            form.resetFields();
            navigate('/liste_declaration')
            fetchData()
        } catch (error) {
            console.error("Erreur lors de l'ajout de la déclaration:", error);
            notification.error({
                message: 'Erreur',
                description: `${error.response.data.error}`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="declarationForm">
            <div className="declaration-wrapper">
                <div className="declaration-left">
                    <Form
                        form={form}
                        name="declaration_form"
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Collapse defaultActiveKey={['1', '2']} accordion>
                            <Panel header="Section Entreposage" key="1">
                                <Form.Item
                                    name="id_template"
                                    label="Template"
                                    rules={[{ required: true, message: "Veuillez entrer l'ID Template Occupé" }]}
                                >
                                    <Select
                                        showSearch
                                        options={templates.map(item => ({ value: item.id_template, label: item.desc_template }))}
                                        placeholder="Sélectionnez..."
                                        onChange={setIdTemplate}
                                        optionFilterProp="label"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="periode"
                                    label="Période"
                                    rules={[{ required: true, message: "Veuillez entrer la période" }]}
                                >
                                    <DatePicker
                                        picker="month"
                                        placeholder="Sélectionnez le mois"
                                        format="YYYY-MM-DD"
                                        style={{ width: '100%' }}
                                        onChange={(date, dateString) => setPeriode(dateString)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="m2_occupe"
                                    label="M² Occupé"
                                    rules={[{ required: false, message: "Veuillez entrer la superficie occupée" }]}
                                >
                                    <InputNumber min={0}
                                     style={{ width: '100%' }}
                                      placeholder="M² Occupé"
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                      />
                                </Form.Item>

                                <Form.Item
                                    name="m2_facture"
                                    label="M² Facturé"
                                    rules={[{ required: false, message: "Veuillez entrer la superficie facturée" }]}
                                >
                                    <InputNumber min={0} 
                                        style={{ width: '100%' }} 
                                        placeholder="M² Facturé"
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                     />
                                </Form.Item>

                                <Form.Item
                                    name="tarif_entreposage"
                                    label="Tarif Entreposage"
                                    rules={[{ required: false, message: "Veuillez entrer le tarif d'entreposage" }]}
                                >
                                    <InputNumber min={0}
                                        style={{ width: '100%' }}
                                      placeholder="Tarif Entreposage" 
                                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                      />
                                </Form.Item>

                                <Form.Item
                                    name="entreposage"
                                    label="Entreposage"
                                    rules={[{ required: false, message: "Veuillez entrer l'Entreposage" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Entreposage" />
                                </Form.Item>

                                <Form.Item
                                    name="debours_entreposage"
                                    label="Débours"
                                    rules={[{ required: false, message: "Veuillez entrer les débours" }]}
                                >
                                    <InputNumber min={0}
                                        style={{ width: '100%' }}
                                      placeholder="Débours"
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                      />
                                </Form.Item>

                                <Form.Item
                                    name="total_entreposage"
                                    label="Total"
                                    rules={[{ required: false, message: "Veuillez entrer le total" }]}
                                >
                                    <InputNumber min={0}
                                        style={{ width: '100%' }}
                                        placeholder="Total"
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                     />
                                    
                                </Form.Item>

                                <Form.Item
                                    name="ttc_entreposage"
                                    label="TTC"
                                    rules={[{ required: false, message: "Veuillez entrer le TTC" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="TTC" />
                                </Form.Item>

                                <Form.Item
                                    name="desc_entreposage"
                                    label="Observation"
                                >
                                    <Input.TextArea rows={4} placeholder="Observation" />
                                </Form.Item>
                            </Panel>

                            <Panel header="Section Manutention" key="2">
                                <Form.Item
                                    name="id_ville"
                                    label="Ville"
                                    rules={[{ required: true, message: "Veuillez entrer l'ID de la ville" }]}
                                >
                                    <Select
                                        showSearch
                                        options={province.map(item => ({ value: item.id, label: item.capital }))}
                                        placeholder="Sélectionnez..."
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="id_client"
                                    label="Client"
                                    rules={[{ required: true, message: "Veuillez entrer l'ID du client" }]}
                                >
                                    <Select
                                        showSearch
                                        options={client.map(item => ({ value: item.id_client, label: item.nom }))}
                                        placeholder="Sélectionnez..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="id_batiments"
                                    label="Bâtiment"
                                    rules={[{ required: false, message: "Veuillez entrer l'ID du bâtiment" }]}
                                >
                                    <Select
                                        mode="multiple"
                                        showSearch
                                        options={batiment.map(item => ({ value: item.id_batiment, label: item.nom_batiment }))}
                                        placeholder="Sélectionnez..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>

                                <Form.Item 
                                    name="id_objet"
                                    label="Objet"
                                    rules={[{ required: false, message: "Veuillez sélectionner un objet" }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Sélectionnez un objet"
                                        options={objet
                                            .filter(item => item.nom_objet_fact.toLowerCase() !== 'superficie') // Filtre "superficie"
                                            .map(item => ({
                                                value: item.id_objet_fact,
                                                label: item.nom_objet_fact
                                            }))
                                        }
                                        optionFilterProp="label"
                                        filterOption={(input, option) => 
                                            option.label.toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="manutation"
                                    label="Manutation"
                                    rules={[{ required: false, message: "Veuillez entrer la manutention" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Manutention" />
                                </Form.Item>

                                <Form.Item
                                    name="tarif_manutation"
                                    label="Tarif Manutation"
                                    rules={[{ required: false, message: "Veuillez entrer le tarif de manutention" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Tarif Manutention" />
                                </Form.Item>

                                <Form.Item
                                    name="debours_manutation"
                                    label="Débours"
                                    rules={[{ required: false, message: "Veuillez entrer les débours" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Débours" />
                                </Form.Item>

                                <Form.Item
                                    name="total_manutation"
                                    label="Total"
                                    rules={[{ required: false, message: "Veuillez entrer le total" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Total" />
                                </Form.Item>

                                <Form.Item
                                    name="ttc_manutation"
                                    label="TTC"
                                    rules={[{ required: false, message: "Veuillez entrer le TTC" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="TTC" />
                                </Form.Item>
                                
                                <Form.Item
                                    name="desc_manutation"
                                    label="Observation"
                                >
                                    <Input.TextArea rows={4} placeholder="Observation" />
                                </Form.Item>
                            </Panel>
                        </Collapse>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                style={{ margin: '10px 0' }} 
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                { idDeclaration ? 'Modifier' : 'Soumettre' }
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="declaration-right">
                    <DeclarationOneClient idClient={idClient} idTemplate={idTemplate} periode={periode} idDeclarations={setIdDeclarations}         key={refreshKey} />
                </div>
            </div>
        </div>
    );
};

export default DeclarationForm;
