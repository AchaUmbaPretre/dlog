import { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Row, Col, Select, notification, Collapse } from 'antd';
import { getDepartement } from '../../../services/departementService';
import { getClient } from '../../../services/clientService';
import { getFormat } from '../../../services/formatService';
import { getFrequence } from '../../../services/frequenceService';
import { getUser } from '../../../services/userService';
import { getControleOne, postControle, putControle } from '../../../services/controleService';
import './controleForm.scss';

const ControleForm = ({ idControle,fetchData,closeModal }) => {
    const [form] = Form.useForm();
    const [departement, setDepartement] = useState([]);
    const [client, setClient] = useState([]);
    const [format, setFormat] = useState([]);
    const [frequence, setFrequence] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleError = (message) => {
        notification.error({
            message: 'Erreur de chargement',
            description: message,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [departementData, formatData, frequenceData, usersData, clientData] = await Promise.all([
                    getDepartement(),
                    getFormat(),
                    getFrequence(),
                    getUser(),
                    getClient(),
                ]);

                setDepartement(departementData.data);
                setFormat(formatData.data);
                setFrequence(frequenceData.data);
                setUsers(usersData.data);
                setClient(clientData.data);

                if (idControle) {
                    const { data: controle } = await getControleOne(idControle);
                    if (controle) {
                        form.setFieldsValue(controle[0]);
                    }
                }
            } catch (error) {
                handleError('Une erreur est survenue lors du chargement des données.');
            }
        };

        fetchData();
    }, [idControle, form]);

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            if (idControle) {
                await putControle(idControle, values);

            } else {
                await postControle(values);

            }
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });

            fetchData();
            closeModal()
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
            <div className="controle_title_rows">
                <h2 className='controle_h2'>{ idControle ? 'Modifier un controle de base': 'Ajouter un controle de base'}</h2>                
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    name="validateOnly"
                    layout="vertical"
                    autoComplete="off"
                    className="custom-form"
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
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
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="id_client"
                                label="Client"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner un client.',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
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
                        <Col xs={24} md={12}>
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
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="controle_de_base"
                                label="Contrôle de base"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir une description.',
                                    },
                                ]}
                            >
                                <Input placeholder="Description..." />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
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
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="responsable"
                                label="Responsable"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez indiquer le responsable.',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    showSearch
                                    options={users.map((item) => ({
                                        value: item.id_utilisateur,
                                        label: item.nom,
                                    }))}
                                    placeholder="Sélectionnez des responsables..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item>
                                <Space className="button-group">
                                    <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
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

export default ControleForm;
