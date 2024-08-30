import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Typography, Row, Col, notification } from 'antd';
import { getUser } from '../../../services/userService';
import { getClient } from '../../../services/clientService';
import { postProjet } from '../../../services/projetService';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ProjetForm = () => {
    const [form] = Form.useForm();
    const [client, setClient] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState([]);

    const handleError = (message) => {
        notification.error({
            message: 'Erreur de chargement',
            description: message,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, clientData] = await Promise.all([
                    getUser(),
                    getClient(),
                ]);

                setUsers(usersData.data);
                setClient(clientData.data);
            } catch (error) {
                handleError('Une erreur est survenue lors du chargement des données.');
            }
        };

        fetchData();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await postProjet(values);
            notification.success({
              message: 'Succès',
              description: 'Le projet a été enregistré avec succès.',
            });
            form.resetFields();
            window.location.reload();
          } catch (error) {
            notification.error({
              message: 'Erreur',
              description: 'Erreur lors de l\'enregistrement du projet.',
            });
          } finally {
            setLoading(false);
          }
       
    };

    return (
        <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                budget: 0,
            }}
        >
            <Title level={3}>Créer un Projet</Title>
            
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Nom du Projet"
                        name="nom_projet"
                        rules={[{ required: true, message: 'Le nom du projet est requis' }]}
                    >
                        <Input placeholder="Entrez le nom du projet" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Chef de Projet"
                        name="chef_projet"
                        rules={[{ required: true, message: 'Le chef de projet est requis' }]}
                    >
                        <Select placeholder="Sélectionnez un chef de projet">
                            {users.map((chef) => (
                                <Option key={chef.id_utilisateur} value={chef.id_utilisateur}>
                                    {chef.nom}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Date de Début"
                        name="date_debut"
                        rules={[{ required: true, message: 'La date de début est requise' }]}
                    >
                        <DatePicker placeholder="Sélectionnez la date de début" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Date de Fin"
                        name="date_fin"
                        rules={[{ required: true, message: 'La date de fin est requise' }]}
                    >
                        <DatePicker placeholder="Sélectionnez la date de fin" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Budget"
                        name="budget"
                        rules={[{ required: false, message: 'Le budget est requis' }]}
                    >
                        <InputNumber
                            placeholder="Entrez le budget"
                            style={{ width: '100%' }}
                            min={0}
                            formatter={(value) => `${value} $`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Client"
                        name="client"
                        rules={[{ required: true, message: 'Le client est requis' }]}
                    >
                        <Select
                            placeholder="Sélectionnez un client"
                            showSearch
                            options={client.map((item) => ({
                                value: item.id_client,
                                label: item.nom,
                            }))}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea placeholder="Entrez la description du projet" rows={4} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Enregistrer
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProjetForm;
