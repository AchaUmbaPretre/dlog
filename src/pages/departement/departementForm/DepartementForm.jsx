import { Button, Form, Input, notification, Modal, Select, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUser } from '../../../services/userService';
import { getDepartementOne, postDepartement, putDepartement } from '../../../services/departementService';

const { Option } = Select;

const DepartementForm = ({ id_departement, fetchData, closeModal }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: users } = await getUser();
                setData(users);

                if (id_departement) {
                    const { data: departements } = await getDepartementOne(id_departement);

                    if (departements.length > 0) {
                        const departement = departements[0];
                        form.setFieldsValue({
                            nom_departement: departement.nom_departement || '',
                            description: departement.description || '',
                            code: departement.code || '',
                            responsable: departement.responsable || '',
                            telephone: departement.telephone || null,
                            email: departement.email || null,
                        });
                    }
                }
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
            }
        };

        fetchData();
    }, [id_departement, form]);

    const showConfirm = (values) => {
        console.log('Valeurs soumises :', values);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);
        setIsLoading(true);
        try {
            const values = form.getFieldsValue();
            if (id_departement) {
                await putDepartement(id_departement, values);
                notification.success({
                    message: 'Succès',
                    description: 'Les informations ont été mises à jour avec succès.',
                });

            } else {
                await postDepartement(values);
                notification.success({
                    message: 'Succès',
                    description: 'Les informations ont été enregistrées avec succès.',
                });
            }
            fetchData();
            closeModal();
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
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>{id_departement ? 'Modifier un département' : 'Ajouter un département'}</h2>                
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Nom de département"
                                name="nom_departement"
                                rules={[{ required: true, message: 'Veuillez entrer le nom de département !' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Téléphone"
                                name="telephone"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ type: 'email', message: 'Veuillez entrer une adresse email valide !' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Code"
                                name="code"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Responsable"
                                name="responsable"
                                rules={[{ required: true, message: 'Veuillez entrer le nom du responsable !' }]}
                            >
                                <Select>
                                    {data.map((chef) => (
                                        <Option key={chef.id_utilisateur} value={chef.id_utilisateur}>
                                            {chef.nom}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                            {id_departement ? 'Mettre à jour' : 'Ajouter'}
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
                    <p>Êtes-vous sûr de vouloir {id_departement ? 'mettre à jour' : 'enregistrer'} ces informations ?</p>
                </Modal>
            </div>
        </div>
    );
};

export default DepartementForm;
