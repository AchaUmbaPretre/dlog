import React, { useEffect, useState } from 'react';
import { Button, Form, Input, notification, Modal, Select, Row, Col } from 'antd';
import { getClient } from '../../../services/clientService';
import { getObjetFacture, getTypeOccupation } from '../../../services/templateService';
import { getBatiment } from '../../../services/typeService';
import { getDenominationOne, getNiveauOne, getWHSEFACTOne } from '../../../services/batimentService';

const TemplateForm = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [client, setClient] = useState([]);
    const [typeOccupation, setTypeOccupation] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const [idBatiment, setIdBatiment] = useState('');
    const [niveau, setNiveau] = useState([]);
    const [denomination, setDenomination] = useState([]);
    const [whse_fact, setWhse_fact] = useState([]);
    const [objet, setObjet] = useState([]);

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
            setObjet(objetData.data)
            
            if (idBatiment) {
                const niveauData = await getNiveauOne(idBatiment);
                const denominationData = await getDenominationOne(idBatiment);
                const whseData = await getWHSEFACTOne(idBatiment);
                setNiveau(niveauData.data);
                setDenomination(denominationData.data);
                setWhse_fact(whseData.data)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataAll();
    }, [idBatiment]);

    const onFinish = async (values) => {
    };

    return (
        <div className="client_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">Insérer un nouveau template </h2>
            </div>
            <div className="client_wrapper">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Client"
                                name="id_client"
                                rules={[{ required: true, message: 'Veuillez sélectionner un client!' }]}
                            >
                                <Select
                                    showSearch
                                    options={client.map((item) => ({
                                        value: item.id_client,
                                        label: item.nom
                                    }))}
                                    placeholder="Sélectionnez un client..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Type d'occupation"
                                name="id_type_occupation"
                                rules={[{ required: true, message: 'Veuillez sélectionner un type d\'occupation!' }]}
                            >
                                <Select
                                    showSearch
                                    options={typeOccupation.map((item) => ({
                                        value: item.id_type_occupation,
                                        label: item.nom_type_d_occupation
                                    }))}
                                    placeholder="Sélectionnez un type d'occupation..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Batiment"
                                name="id_batiment"
                                rules={[{ required: true, message: 'Veuillez sélectionner un bâtiment!' }]}
                            >
                                <Select
                                    showSearch
                                    options={batiment.map((item) => ({
                                        value: item.id_batiment,
                                        label: item.nom_batiment
                                    }))}
                                    placeholder="Sélectionnez un bâtiment..."
                                    optionFilterProp="label"
                                    onChange={(value) => setIdBatiment(value)} // Met à jour idBatiment lorsque le bâtiment est sélectionné
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Niveau"
                                name="id_niveau"
                                rules={[{ required: true, message: 'Veuillez sélectionner un niveau!' }]}
                            >
                                <Select
                                    showSearch
                                    options={niveau.map((item) => ({
                                        value: item.id_niveau,
                                        label: item.nom_niveau
                                    }))}
                                    placeholder="Sélectionnez un niveau..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Dénomination"
                                name="id_denomination_bat"
                                rules={[{ required: true, message: 'Veuillez sélectionner un niveau!' }]}
                            >
                                <Select
                                    showSearch
                                    options={denomination.map((item) => ({
                                        value: item.id_denomination_bat,
                                        label: item.nom_denomination_bat
                                    }))}
                                    placeholder="Sélectionnez une dénomination..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Werahouse facture"
                                name="id_whse_fact"
                                rules={[{ required: true, message: 'Veuillez sélectionner un Werahouse facture!' }]}
                            >
                                <Select
                                    showSearch
                                    options={whse_fact.map((item) => ({
                                        value: item.id_whse_fact,
                                        label: item.nom_whse_fact
                                    }))}
                                    placeholder="Sélectionnez un Werahouse facture..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Objet facture"
                                name="id_objet_fact"
                                rules={[{ required: true, message: 'Veuillez sélectionner un objet facture!' }]}
                            >
                                <Select
                                    showSearch
                                    options={objet.map((item) => ({
                                        value: item.id_objet_fact,
                                        label: item.nom_objet_fact
                                    }))}
                                    placeholder="Sélectionnez un objet facture..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default TemplateForm;
