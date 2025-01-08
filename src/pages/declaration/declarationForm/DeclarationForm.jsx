import React, { useEffect, useState } from 'react';
import { PlusCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, Button, Select, DatePicker, notification, Tabs, Modal, Tooltip } from 'antd';
import './declarationForm.scss';
import { getDeclarationOne, getObjetFacture, getTemplate, getTemplateOne, postDeclaration, putDeclaration } from '../../../services/templateService';
import { getClient, getProvince } from '../../../services/clientService';
import { getBatiment } from '../../../services/typeService';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import DeclarationOneClient from '../declarationOneClient/DeclarationOneClient';
import TemplateForm from '../../template/templateForm/TemplateForm';

const { Option } = Select;
const { TabPane } = Tabs;

const DeclarationForm = ({closeModal, fetchData, idDeclaration, idDeclarationss, idClients}) => {
    const [form] = Form.useForm();
    const [templates, setTemplates] = useState([]);
    const [idTemplate, setIdTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [objet, setObjet] = useState([]);
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const navigate = useNavigate();
    const [idClient, setIdClient] = useState(idClients);
    const [idDeclarations, setIdDeclarations] = useState(idDeclarationss);
    const [periode, setPeriode] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeKey, setActiveKey] = useState(['1', '2']);
    const [modalType, setModalType] = useState(null);

    const closeAllModals = () => {
        setModalType(null);
      };
      
      const openModal = (type, idDeclaration = '') => {
        closeAllModals();
        setModalType(type);
      };

    const handleAdd = () => {
        openModal('Add');
      }

    const handleTabChange = (key) => {
      setActiveKey(key);
    };

    useEffect(() => {
        setIdDeclarations(idDeclarationss);
    }, [idDeclarationss]);

    useEffect(() => {
        setIdClient(idClients);
    }, [idClients]);

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
            const { data } = await getTemplateOne(idTemplate);
            const { id_ville, id_client } = data[0];
    
            form.resetFields();
    
            form.setFieldsValue({
                id_ville,
                id_client,
                id_template: idTemplate,
            });
    
            setIdDeclarations('')
            setIdClient(id_client);
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        if (idTemplate) {
            handleTemplateChange();
        }
    }, [idTemplate]);
    


    const onFinish = async (values) => {
        console.log(values)
        setIsLoading(true);
        await form.validateFields();

        try {
            if(idDeclaration) {
                await putDeclaration(idDeclaration, values)
            }
            else{
                await postDeclaration(values);
                setRefreshKey((prev) => prev + 1);
                setPeriode(null)
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
                    onValuesChange={(changedValues, allValues) => {
                            const { m2_facture, tarif_entreposage, entreposage, total_entreposage, ttc_entreposage } = allValues;

                            const m2Facture = parseFloat(m2_facture) || 0;
                            const tarifEntreposage = parseFloat(tarif_entreposage) || 0;
                            const entreposageVal = parseFloat(entreposage) || 0;

                            if (changedValues.total_entreposage !== undefined || changedValues.ttc_entreposage !== undefined) {
                            return; 
                            }

                            if (!total_entreposage) {
                            const totalEntreposage = (m2Facture * tarifEntreposage) + entreposageVal;
                            form.setFieldsValue({
                                total_entreposage: totalEntreposage.toFixed(2),
                            });
                            }

                            if (!ttc_entreposage) {
                            const totalEntreposage = (m2Facture * tarifEntreposage) + entreposageVal;
                            const ttcEntreposage = totalEntreposage * 1.16;
                            form.setFieldsValue({
                                ttc_entreposage: ttcEntreposage.toFixed(2),
                            });
                            }
                        }}
                    >
                    <Tabs
                        activeKey={activeKey[0]}
                        onChange={handleTabChange}
                        type="card"
                        tabPosition="top"
                        renderTabBar={(props, DefaultTabBar) => (
                        <DefaultTabBar {...props} />
                        )}
                    >
                        <TabPane tab="Section Entreposage" key="1">
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
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="M² Occupé" parser={(value) => value.replace(/\$\s?|(,*)/g, '')} />
                        </Form.Item>

                        <Form.Item
                            name="m2_facture"
                            label="M² Facturé"
                            rules={[{ required: false, message: "Veuillez entrer la superficie facturée" }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="M² Facturé" parser={(value) => value.replace(/\$\s?|(,*)/g, '')} />
                        </Form.Item>

                        <Form.Item
                            name="tarif_entreposage"
                            label="Tarif Entreposage"
                            rules={[{ required: false, message: "Veuillez entrer le tarif d'entreposage" }]}
                        >
                            <InputNumber 
                                min={0} style={{ width: '100%' }} placeholder="Tarif Entreposage" 
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
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="Débours" parser={(value) => value.replace(/\$\s?|(,*)/g, '')} />
                        </Form.Item>
                        <div style={{display:'flex', gap:'10px', alignItems:'center', width:'100%'}}>
                        <Form.Item
                            name="total_entreposage"
                            label="Total"
                            rules={[{ required: false, message: "Veuillez entrer le total" }]}
                            style={{flex:'6'}}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="Total" parser={(value) => value.replace(/\$\s?|(,*)/g, '')} 
                                onChange={(value) => {
                                        form.setFieldsValue({
                                        total_entreposage: value,
                                        });
                                 }} 
                            />
                        </Form.Item>
                        <Button
                            type="default"
                            style={{ marginLeft: '10px', flex:'1' }}
                            onClick={() => {
                                const m2Facture = parseFloat(form.getFieldValue('m2_facture')) || 0;
                                const tarifEntreposage = parseFloat(form.getFieldValue('tarif_entreposage')) || 0;
                                const entreposageVal = parseFloat(form.getFieldValue('entreposage')) || 0;
                                
                                const totalEntreposage = (m2Facture * tarifEntreposage) + entreposageVal;
                                form.setFieldsValue({
                                total_entreposage: totalEntreposage.toFixed(2),
                                });

                                const ttcEntreposage = totalEntreposage * 1.16;
                                form.setFieldsValue({
                                ttc_entreposage: ttcEntreposage.toFixed(2),
                                });
                            }}
                        >
                            +
                        </Button>
                        </div>

                        <Form.Item
                            name="ttc_entreposage"
                            label="TTC"
                            rules={[{ required: false, message: "Veuillez entrer le TTC" }] }
                        >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="TTC" onChange={(value) => {
                                        form.setFieldsValue({
                                        ttc_entreposage: value,
                                        });
                                 }}  />
                        </Form.Item>

                        <Form.Item
                            name="desc_entreposage"
                            label="Observation"
                        >
                            <Input.TextArea rows={4} placeholder="Observation" />
                        </Form.Item>
                        </TabPane>

                        <TabPane tab="Section Manutention" key="2">
                        <Form.Item
                            name="id_ville"
                            label="Ville"
                            rules={[{ required: true, message: "Veuillez entrer l'ID de la ville" }]}
                        >
                            <Select
                                showSearch
                                options={province.map(item => ({ value: item.id, label: item.capital }))}
                                placeholder="Sélectionnez..."
                                optionFilterProp="label"
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
                                .filter(item => item.nom_objet_fact.toLowerCase() !== 'superficie') // Filtrer "superficie"
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
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="Tarif Manutation" />
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
                        </TabPane>
                    </Tabs>

                    <Form.Item>
                        <Button
                        type="primary"
                        htmlType="submit"
                        style={{ margin: '10px 0' }}
                        loading={isLoading}
                        disabled={isLoading}
                        >
                        {idDeclaration ? 'Modifier' : 'Soumettre'}
                        </Button>
                    </Form.Item>
                    </Form>

                </div>
                <div className="declaration-right">
                    <div className="declaration-modal-templ">
                        <Tooltip title="Créer un template">
                            <div className="templ-icon"
                                onClick={handleAdd}
                                style={{
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <PlusCircleOutlined/>
                            </div>
                        </Tooltip>
                        <Tooltip title="Voir le détail">
                            <div className="templ-icon"
                                onClick={handleAdd}
                                style={{
                                        transition: 'transform 0.2s',
                                        background:'#88bfec'
                                    }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <EyeOutlined/>
                            </div>    
                        </Tooltip>
                    </div>
                    <DeclarationOneClient idClient={idClient} idTemplate={idTemplate} periode={periode} idDeclarations={setIdDeclarations} key={refreshKey} />
                </div>
            </div>
            <Modal
                title=""
                visible={modalType === 'Add'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <TemplateForm closeModal={() => setModalType(null)} fetchData={fetchDataAll} />
            </Modal>
        </div>
    );
};

export default DeclarationForm;
