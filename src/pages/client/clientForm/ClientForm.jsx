import { Button, Form, Input, notification, Select, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import './ClientForm.scss';
import { useNavigate } from 'react-router-dom';
import { getClient_type, getProvince, postClient } from '../../../services/clientService';


const ClientForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchProvince = async () => {
            try {
                const response = await getProvince();
                setProvinces(response.data);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des provinces.',
                });
            }
        };

        fetchProvince();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getClient_type();
                setTypes(response.data);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des types de client.',
                });
            }
        };

        fetchData();
    }, []);

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            await postClient(values);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            navigate('/client');
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
        <div className="client-form-container">
            <div className="client-form-wrapper">
                <Form layout="vertical" onFinish={onFinish}>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Informations Générales" key="1">
                            <Form.Item
                                label="Nom"
                                name="nom"
                                rules={[{ required: true, message: 'Veuillez entrer le nom du client !' }]}
                            >
                                <Input placeholder="Entrez le nom du client" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ type: 'email', message: "L'email doit être valide !" }]}
                            >
                                <Input placeholder="Entrez l'email du client" />
                            </Form.Item>

                            <Form.Item
                                label="Téléphone"
                                name="telephone"
                                rules={[{ required: true, message: 'Veuillez entrer le téléphone du client !' }]}
                            >
                                <Input placeholder="Entrez le téléphone du client" />
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Localisation" key="2">
                            <Form.Item
                                label="Ville"
                                name="ville"
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

                            <Form.Item
                                label="Adresse"
                                name="adresse"
                                rules={[{ required: true, message: "Veuillez entrer l'adresse !" }]}
                            >
                                <Input placeholder="Entrez l'adresse..." />
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Type de Client" key="3">
                            <Form.Item
                                label="Type de client"
                                name="id_type_client"
                            >
                                <Select
                                    showSearch
                                    options={types?.map((item) => ({
                                        value: item.id_type_client,
                                        label: item.nom_type,
                                    }))}
                                    placeholder="Sélectionnez un type..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Actions" key="4">
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isLoading}>
                                    Ajouter
                                </Button>
                            </Form.Item>
                        </Tabs.TabPane>
                    </Tabs>
                </Form>
            </div>
        </div>
    );
};

export default ClientForm;
