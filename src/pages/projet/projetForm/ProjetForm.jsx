import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Typography, Row, Col, notification, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getUser } from '../../../services/userService';
import { getClient } from '../../../services/clientService';
import { postProjet } from '../../../services/projetService';
import { getArticle, getBatiment } from '../../../services/typeService';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ProjetForm = () => {
    const [form] = Form.useForm();
    const [client, setClient] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [batiment, setBatiment] = useState([]);
    const [article, setArticle] = useState([])

    const handleError = (message) => {
        notification.error({
            message: 'Erreur de chargement',
            description: message,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, clientData, batimentData, articleData] = await Promise.all([
                    getUser(),
                    getClient(),
                    getBatiment(),
                    getArticle()
                ]);

                setUsers(usersData.data);
                setClient(clientData.data);
                setBatiment(batimentData.data);
                setArticle(articleData.data)

            } catch (error) {
                handleError('Une erreur est survenue lors du chargement des données.');
            }
        };

        fetchData();
    }, []);

    const onFinish = async (values) => {
        console.log(values)
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
            form={form}
            initialValues={{
                budget: 0,
            }}
        >
            <Title level={3}>Créer un Projet</Title>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Titre"
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
                        label="Entité"
                        name="id_batiment"
                        rules={[{ required: false, message: "L'entité est requise" }]}
                    >
                        <Select
                            placeholder="Sélectionnez un batiment"
                            showSearch
                            options={batiment.map((item) => ({
                                value: item.id_batiment,
                                label: item.nom_batiment,
                            }))}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Form.List name="besoins">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }}>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'id_article']}
                                    fieldKey={[fieldKey, 'id_article']}
                                    label="Article"
                                    rules={[{ required: true, message: "Sélectionnez une article..."  }]}
                                >
                                    <Select
                                        placeholder="Sélectionnez une article"
                                        showSearch
                                        options={article.map((item) => ({
                                            value: item.id_article,
                                            label: item.nom_article,
                                        }))}
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'description']}
                                    fieldKey={[fieldKey, 'description']}
                                    label="Description"
                                    rules={[{ required: false, message: 'La description est requise' }]}
                                >
                                    <Input placeholder="Entrez une description" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'quantite']}
                                    fieldKey={[fieldKey, 'quantite']}
                                    label="Quantité"
                                    rules={[{ required: true, message: 'La quantité est requise' }]}
                                >
                                    <InputNumber placeholder="Entrez la quantité" min={1} />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                            >
                                Ajouter un besoin
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Enregistrer
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProjetForm;
