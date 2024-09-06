import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Row, Col, Select, notification, DatePicker } from 'antd';
import { getDepartement } from '../../../services/departementService';
import { getClient, getProvince } from '../../../services/clientService';
import { getFormat } from '../../../services/formatService';
import { getFrequence } from '../../../services/frequenceService';
import { getUser } from '../../../services/userService';
import { useNavigate } from 'react-router-dom';
import { postTache } from '../../../services/tacheService';

const TacheForm = ({idControle, idProjet}) => {
    const [departement, setDepartement] = useState([]);
    const [client, setClient] = useState([]);
    const [format, setFormat] = useState([]);
    const [frequence, setFrequence] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const navigate = useNavigate();

    const handleError = (message) => {
        notification.error({
            message: 'Erreur de chargement',
            description: message,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [departementData, formatData, frequenceData, usersData, clientData, provinceData] = await Promise.all([
                    getDepartement(),
                    getFormat(),
                    getFrequence(),
                    getUser(),
                    getClient(),
                    getProvince()
                ]);

                setDepartement(departementData.data);
                setFormat(formatData.data);
                setFrequence(frequenceData.data);
                setUsers(usersData.data);
                setClient(clientData.data);
                setProvinces(provinceData.data);
            } catch (error) {
                handleError('Une erreur est survenue lors du chargement des données.');
            }
        };

        fetchData();
    }, []);

    const onFinish = async (values) => {
        const dataAll = {
            ...values,
            id_control : idControle,
            id_projet: idProjet
        }
        setIsLoading(true);
        try {
            await postTache(dataAll);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            navigate('/tache');
            window.location.reload();
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Une erreur s\'est produite lors de l\'enregistrement des informations.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="controle_form">
            <div className="controle_wrapper">
                <Form
                    name="validateOnly"
                    layout="vertical"
                    autoComplete="off"
                    className="custom-form"
                    onFinish={onFinish}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="nom_tache"
                                label="Nom"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir un nom...',
                                    },
                                ]}
                            >
                                <Input placeholder="Nom..." />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="date_debut"
                                label="Date début"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner une date de début.',
                                    },
                                ]}
                            >
                                <DatePicker style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="date_fin"
                                label="Date fin"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner une date de fin.',
                                    },
                                ]}
                            >
                                <DatePicker style={{width:'100%'}}  />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="id_departement"
                                label="Département"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner un département.',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    options={departement.map((item) => ({
                                        value: item.id_departement,
                                        label: item.nom_departement,
                                    }))}
                                    placeholder="Sélectionnez un département..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="id_client"
                                label="Client"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Veuillez sélectionner un client.',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    options={client.map((item) => ({
                                        value: item.id_client,
                                        label: item.nom,
                                    }))}
                                    placeholder="Sélectionnez un client..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="id_format"
                                label="Format"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner un format.',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    options={format.map((item) => ({
                                        value: item.id_format,
                                        label: item.nom_format,
                                    }))}
                                    placeholder="Sélectionnez un format..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Ville"
                                name="id_ville"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner une ville.',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    options={provinces?.map((item) => ({
                                        value: item.id,
                                        label: item.capital,
                                    }))}
                                    placeholder="Sélectionnez une ville..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="id_frequence"
                                label="Fréquence"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez indiquer la fréquence.',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    options={frequence.map((item) => ({
                                        value: item.id_frequence,
                                        label: item.nom,
                                    }))}
                                    placeholder="Sélectionnez une fréquence..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="responsable_principal"
                                label="Owner"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez indiquer le responsable.',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    options={users.map((item) => ({
                                        value: item.id_utilisateur,
                                        label: `${item.nom}`,
                                    }))}
                                    placeholder="Sélectionnez un responsable..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24}>
                            <Form.Item
                                name="id_demandeur"
                                label="Demandeur"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez indiquer un demandeur.',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    options={users.map((item) => ({
                                        value: item.id_utilisateur,
                                        label: `${item.nom}`,
                                    }))}
                                    placeholder="Sélectionnez un demandeur..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Veuillez fournir une description.',
                                    },
                                ]}
                            >
                                <Input.TextArea style={{height:'100px'}} placeholder="Description..." />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item>
                                <Space className="button-group">
                                    <Button type="primary" htmlType="submit" loading={isLoading}>
                                        Envoyer
                                    </Button>
                                    <Button htmlType="reset">
                                        Réinitialiser
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default TacheForm;
