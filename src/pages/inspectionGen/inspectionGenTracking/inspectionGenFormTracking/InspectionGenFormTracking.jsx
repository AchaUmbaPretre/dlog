import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Row, Col, Select, notification, InputNumber, Checkbox } from 'antd';
import { getTypes } from '../../../../services/typeService';
import { getUser } from '../../../../services/userService';
import { colorMapping } from '../../../../utils/prioriteIcons';
import { postSuiviInspections } from '../../../../services/charroiService';


const InspectionGenFormTracking = ({idSubInspectionGen, closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [type, setType] = useState([]);
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
                const [typeData, userData] = await Promise.all([
                    getTypes(),
                    getUser()
                ]);

                setType(typeData.data);
                setUsers(userData.data);
/*                 if(idTache){
                    const {data} = await getTacheOne(idTache)
                    setName(data.tache[0])
                } */
            } catch (error) {
                handleError('Une erreur est survenue lors du chargement des données.');
            }
        };

        fetchData();
    }, [idSubInspectionGen]);

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
             await postSuiviInspections({
                ...values,
                id_sub_inspection_gen: idSubInspectionGen
            });
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            fetchData();
            closeModal();
            form.resetFields();
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
                <h2 className="controle_h2">TRACKING D'INSPECTION</h2>
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
                    <Row gutter={24} justify="center">
                        <Col span={24}>
                            <Form.Item
                                name="commentaire"
                                label="Commentaires"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez entrer les commentaires.',
                                    },
                                ]}
                            >
                                <Input.TextArea style={{ height: '70px' }} placeholder="Commentaire..." />
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
                                        label: `${item.nom}`,
                                    }))}
                                    placeholder="Sélectionnez un responsable..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Pourcentage d'Avancement"
                                name="pourcentage_avancement"
                                rules={[{ required: true, message: 'Veuillez indiquer l\'avancement en pourcentage' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    formatter={value => `${value}%`}
                                    parser={value => value.replace('%', '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="est_termine"
                                valuePropName="checked"
                            >
                                <Checkbox>Marquer comme terminé</Checkbox>
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

export default InspectionGenFormTracking;
