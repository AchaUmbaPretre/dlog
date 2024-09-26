import { Button, Form, Input, notification, Modal, Select, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postBatiment } from '../../../services/typeService';
import { getProvince } from '../../../services/clientService';

const BatimentForm = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [data, setData] = useState([]);

    const showConfirm = (values) => {
        setFormValues(values); 
        setIsModalVisible(true);
    };

    useEffect(() => {
        const fetchDataGet = async () => {
            try {
                const response = await getProvince();
                setData(response.data);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
            }
        };
    
        fetchDataGet();
    }, []);

    const handleOk = async () => {
        setIsModalVisible(false);
        setIsLoading(true);
        try {
            await postBatiment(formValues);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            form.resetFields();
            closeModal();
            fetchData();
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Une erreur s\'est produite lors de l\'enregistrement des informations.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false); 
    };

    const onFinish = (values) => {
        showConfirm(values);
    };

    return (
        <div className="client_form">
            <div className="client_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Nom du bâtiment"
                                name="nom_batiment"
                                rules={[{ required: true, message: 'Veuillez entrer le nom du bâtiment!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Site"
                                name="site"
                                rules={[{ required: false, message: 'Veuillez entrer le nom du site!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Ville"
                                name="ville"
                                rules={[{ required: true, message: 'Veuillez sélectionner une ville!' }]}
                            >
                                <Select
                                    showSearch
                                    options={data.map((item) => ({
                                        value: item.id,
                                        label: item.name,
                                    }))}
                                    placeholder="Sélectionnez une ville..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Longueur"
                                name="longueur"
                                rules={[{ required: true, message: 'Veuillez entrer la longueur!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Largeur"
                                name="largeur"
                                rules={[{ required: true, message: 'Veuillez entrer la largeur!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Hauteur"
                                name="hauteur"
                                rules={[{ required: true, message: 'Veuillez entrer la hauteur!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Surface du sol"
                                name="surface_sol"
                                rules={[{ required: true, message: 'Veuillez entrer la surface du sol!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Surface des murs"
                                name="surface_murs"
                                rules={[{ required: true, message: 'Veuillez entrer la surface des murs!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Mètres linéaires"
                                name="metres_lineaires"
                                rules={[{ required: true, message: 'Veuillez entrer les mètres linéaires!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                            Ajouter
                        </Button>
                    </Form.Item>
                </Form>

                <Modal
                    title="Confirmer la soumission"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Confirmer"
                    cancelText="Annuler"
                >
                    <p>Êtes-vous sûr de vouloir enregistrer ces informations ?</p>
                </Modal>
            </div>
        </div>
    );
};

export default BatimentForm;
