import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Row, Col, Select, notification } from 'antd';
import { getUser } from '../../../services/userService';
import { useNavigate } from 'react-router-dom';
import './suiviControle.scss';
import { getTypes } from '../../../services/typeService';
import { postSuivi } from '../../../services/suiviService';

const colorMapping = {
    'En attente': '#FFA500', // Orange
    'En cours': '#1E90FF',   // Blue
    'Point bloquant': '#FF4500', // Red-Orange
    'En attente de validation': '#32CD32', // Lime Green
    'Validé': '#228B22', // Forest Green
    'Budget': '#FFD700', // Gold
    'Exécuté': '#A9A9A9', // Dark Gray
    1: '#32CD32',
    0: '#FF6347'
};

const SuiviControle = ({idControle}) => {
    const [type, setType] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    console.log('text' + idControle)

    const handleError = (message) => {
        notification.error({
            message: 'Erreur de chargement',
            description: message,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typeData, userData] = await Promise.all([
                    getTypes(),
                    getUser()
                ]);

                setType(typeData.data);
                setUsers(userData.data);
            } catch (error) {
                handleError('Une erreur est survenue lors du chargement des données.');
            }
        };

        fetchData();
    }, []);

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            await postSuivi({
                ...values,
                id_controle: idControle
            });
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
                                    ].map(option => ({
                                        ...option,
                                        label: (
                                            <div style={{ color: colorMapping[option.value] }}>
                                                {option.label}
                                            </div>
                                        )
                                    }))}
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
                                    options={type.map((item) => ({
                                        value: item.id_type_statut_suivi,
                                        label: (
                                            <div style={{ color: colorMapping[item.nom_type_statut] }}>
                                                {item.nom_type_statut}
                                            </div>
                                        ),
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item style={{ marginTop: '10px' }}>
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
