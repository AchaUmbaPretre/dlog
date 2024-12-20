import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, DatePicker, Collapse, notification } from 'antd';
import './declarationForm.scss';
import TemplateOne from '../../template/templateOne/TemplateOne';
import { getDeclarationOne, getObjetFacture, getTemplate, getTemplateOne, postDeclaration, putDeclaration } from '../../../services/templateService';
import { getClient, getProvince } from '../../../services/clientService';
import { getBatiment } from '../../../services/typeService';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

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

        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        }
    };

    useEffect(() => {
        fetchDataAll()
    }, []);

    const handleTemplateChange = async () => {
        try {
            const { data} = await getTemplateOne(idTemplate);
            const { id_ville } = data[0];
        
            form.setFieldsValue({
                id_ville
            });
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement du template',
                description: 'Impossible de charger les informations du template sélectionné.',
            });
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
            }
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            form.resetFields();
            navigate('/liste_declaration')
            closeModal();
            fetchData()
        } catch (error) {
            console.error("Erreur lors de l'ajout de la déclaration:", error);
            notification.error({
                message: 'Erreur',
                description: 'Une erreur s\'est produite lors de l\'ajout de la déclaration.',
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
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="m2_occupe"
                                    label="M² Occupé"
                                    rules={[{ required: false, message: "Veuillez entrer la superficie occupée" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="M² Occupé" />
                                </Form.Item>

                                <Form.Item
                                    name="m2_facture"
                                    label="M² Facturé"
                                    rules={[{ required: false, message: "Veuillez entrer la superficie facturée" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="M² Facturé" />
                                </Form.Item>

                                <Form.Item
                                    name="tarif_entreposage"
                                    label="Tarif Entreposage"
                                    rules={[{ required: false, message: "Veuillez entrer le tarif d'entreposage" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Tarif Entreposage" />
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
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Débours" />
                                </Form.Item>

                                <Form.Item
                                    name="total_entreposage"
                                    label="Total"
                                    rules={[{ required: false, message: "Veuillez entrer le total" }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Total" />
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
                                    rules={[{ required: false, message: "Veuillez entrer l'ID du client" }]}
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
                    <TemplateOne idTemplate={idTemplate} />
                </div>
            </div>
        </div>
    );
};

export default DeclarationForm;
