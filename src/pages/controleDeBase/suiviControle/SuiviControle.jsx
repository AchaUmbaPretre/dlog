import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Row, Col, Select, notification } from 'antd';
import { getDepartement } from '../../../services/departementService';
import { getClient } from '../../../services/clientService';
import { getFormat } from '../../../services/formatService';
import { getFrequence } from '../../../services/frequenceService';
import { getUser } from '../../../services/userService';
import { postControle } from '../../../services/controleService';
import { useNavigate } from 'react-router-dom';
import './suiviControle.scss';

const SuiviControle = () => {
    const [departement, setDepartement] = useState([]);
    const [client, setClient] = useState([]);
    const [format, setFormat] = useState([]);
    const [frequence, setFrequence] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
            } catch (error) {
                handleError('Une erreur est survenue lors du chargement des données.');
            }
        };

        fetchData();
    }, []);

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            await postControle(values);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            navigate('/controle');
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
                    <Row gutter={24} justify="center">
                        <Col span={24}>
                            <Form.Item
                                name="commentaires"
                                label="Commentaires"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez entrer les commentaires.',
                                    },
                                ]}
                            >
                                <Input.TextArea style={{ height: '100px' }} placeholder="Commentaire..." />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="effectue_par"
                                label="Effectué par"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner une personne.',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    options={users.map((item) => ({
                                        value: item.id_utilisateur,
                                        label: `${item.nom} - ${item.prenom}`,
                                    }))}
                                    placeholder="Sélectionnez un responsable..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="est_termine"
                                label="Suivi terminé"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez indiquer si le suivi est terminé.',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Sélectionnez une option..."
                                    options={[
                                        { value: 1, label: 'Oui' },
                                        { value: 0, label: 'Non' }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="status"
                                label="Statut du suivi"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner le statut du suivi.',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Sélectionnez le statut..."
                                    options={[
                                        { value: 'en_cours', label: 'En cours' },
                                        { value: 'complete', label: 'Complété' },
                                        { value: 'a_revoir', label: 'À revoir' },
                                        { value: 'annule', label: 'Annulé' }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} >
                            <Form.Item style={{marginTop:'10px'}}>
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

export default SuiviControle;
