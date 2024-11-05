import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Row, Col, DatePicker, notification } from 'antd';
import { getClient } from '../../../services/clientService';
import { getObjetFacture, getTypeOccupation, postTemplate } from '../../../services/templateService';
import { getBatiment } from '../../../services/typeService';
import { getDenominationOne, getNiveauOne, getWHSEFACTOne } from '../../../services/batimentService';
import moment from 'moment';

const TemplateForm = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [client, setClient] = useState([]);
    const [typeOccupation, setTypeOccupation] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const [idBatiment, setIdBatiment] = useState('');
    const [niveau, setNiveau] = useState([]);
    const [denomination, setDenomination] = useState([]);
    const [whse_fact, setWhse_fact] = useState([]);
    const [objet, setObjet] = useState([]);

    // Fetch data from multiple services
    const fetchDataAll = async () => {
        setIsLoading(true);
        try {
            const [clientData, typeOccupationData, batimentData, objetData] = await Promise.all([
                getClient(),
                getTypeOccupation(),
                getBatiment(),
                getObjetFacture()
            ]);

            setClient(clientData.data);
            setTypeOccupation(typeOccupationData.data);
            setBatiment(batimentData.data);
            setObjet(objetData.data);

            if (idBatiment) {
                const [niveauData, denominationData, whseData] = await Promise.all([
                    getNiveauOne(idBatiment),
                    getDenominationOne(idBatiment),
                    getWHSEFACTOne(idBatiment)
                ]);
                setNiveau(niveauData.data);
                setDenomination(denominationData.data);
                setWhse_fact(whseData.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataAll();
    }, [idBatiment]);

    useEffect(() => {
        form.resetFields()
      }, [form]);

    const onFinish = async (values) => {
        setIsLoading(true)

        try {
            await postTemplate(values)
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            form.resetFields();
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="client_form" style={{ padding: '20px', background: '#fff', borderRadius: '5px' }}>
            <div className="controle_title_rows">
                <h2 className="controle_h2">Insérer un nouveau template</h2>
            </div>
            <div className="client_wrapper">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Client"
                                name="id_client"
                                rules={[{ required: true, message: 'Veuillez sélectionner un client!' }]}
                            >
                                <Select
                                    showSearch
                                    options={client.map(item => ({ value: item.id_client, label: item.nom }))}
                                    placeholder="Sélectionnez un client..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Type d'occupation"
                                name="id_type_occupation"
                                rules={[{ required: true, message: 'Veuillez sélectionner un type d\'occupation!' }]}
                            >
                                <Select
                                    showSearch
                                    options={typeOccupation.map(item => ({ value: item.id_type_d_occupation, label: item.nom_type_d_occupation }))}
                                    placeholder="Sélectionnez un type d'occupation..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Bâtiment"
                                name="id_batiment"
                                rules={[{ required: true, message: 'Veuillez sélectionner un bâtiment!' }]}
                            >
                                <Select
                                    showSearch
                                    options={batiment.map(item => ({ value: item.id_batiment, label: item.nom_batiment }))}
                                    placeholder="Sélectionnez un bâtiment..."
                                    optionFilterProp="label"
                                    onChange={(value) => setIdBatiment(value)}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Niveau"
                                name="id_niveau"
                                rules={[{ required: true, message: 'Veuillez sélectionner un niveau!' }]}
                            >
                                <Select
                                    showSearch
                                    options={niveau.map(item => ({ value: item.id_niveau, label: item.nom_niveau }))}
                                    placeholder="Sélectionnez un niveau..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Dénomination"
                                name="id_denomination"
                                rules={[{ required: true, message: 'Veuillez sélectionner une dénomination!' }]}
                            >
                                <Select
                                    showSearch
                                    options={denomination.map(item => ({ value: item.id_denomination_bat, label: item.nom_denomination_bat }))}
                                    placeholder="Sélectionnez une dénomination..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Warehouse facture"
                                name="id_whse_fact"
                                rules={[{ required: true, message: 'Veuillez sélectionner un Warehouse facture!' }]}
                            >
                                <Select
                                    showSearch
                                    options={whse_fact.map(item => ({ value: item.id_whse_fact, label: item.nom_whse_fact }))}
                                    placeholder="Sélectionnez un Warehouse facture..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                            <Form.Item
                                label="Objet facture"
                                name="id_objet_fact"
                                rules={[{ required: true, message: 'Veuillez sélectionner un objet facture!' }]}
                            >
                                <Select
                                    showSearch
                                    options={objet.map(item => ({ value: item.id_objet_fact, label: item.nom_objet_fact }))}
                                    placeholder="Sélectionnez un objet facture..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                            <Form.Item
                                label="Date actif"
                                name="date_actif"
                                rules={[{ required: true, message: 'La date active est requise' }]}
                                initialValue={moment()}
                            >
                                <DatePicker placeholder="Sélectionnez la date active" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Description"
                                name="desc_template"
                            >
                                <Input.TextArea
                                    style={{ height: '100px', resize: 'none' }}
                                    placeholder="Entrez la description..."
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                            Enregistrer
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default TemplateForm;