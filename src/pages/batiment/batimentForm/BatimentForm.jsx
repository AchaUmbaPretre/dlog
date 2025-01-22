import { Button, Form, Input, notification, Modal, Select, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { getBatimentOne, getStatus_batiment, postBatiment, putBatiment } from '../../../services/typeService';
import { getProvince } from '../../../services/clientService';

const { Option } = Select;

const BatimentForm = ({ idBatiment, closeModal, fetchData }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [data, setData] = useState([]);
    const [types, setTypes] = useState([]);


    const showConfirm = (values) => {
        setFormValues(values); 
        setIsModalVisible(true);
    };

    useEffect(() => {
        const fetchDataGet = async () => {
            try {
                const response = await getProvince();
                const responseType = await getStatus_batiment();

                setData(response.data);
                setTypes(responseType.data);

                if (idBatiment) {
                    const { data: batiments } = await getBatimentOne(idBatiment);
                    const batiment = batiments[0];
                    form.setFieldsValue(batiment);
                }
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
            }
        };

        fetchDataGet();
    }, [idBatiment, form]);

    const handleOk = async () => {
        setIsModalVisible(false);
        setIsLoading(true);
        try {
            const values = form.getFieldsValue();
            if (idBatiment) {
                await putBatiment(idBatiment, values);
                notification.success({
                    message: 'Succès',
                    description: 'Le bâtiment a été mis à jour avec succès.',
                });
            } else {
                await postBatiment(values);
                notification.success({
                    message: 'Succès',
                    description: 'Le bâtiment a été ajouté avec succès.',
                });
            }
            form.resetFields();
            closeModal();
            fetchData();
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: error.response?.data?.message || "Une erreur s'est produite lors de l'enregistrement des informations.",
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
            <div className="controle_title_rows">
                <h2 className="controle_h2">{idBatiment ? "Modifier le bâtiment" : "Insérer un nouveau bâtiment"}</h2>
            </div>
            <div className="client_wrapper">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Nom du bâtiment"
                                name="nom_batiment"
                                rules={[{ required: true, message: 'Veuillez entrer le nom du bâtiment!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Site" name="site">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Ville"
                                name="ville"
                                rules={[{ required: true, message: 'Veuillez sélectionner une ville!' }]}
                            >
                                <Select
                                    showSearch
                                    options={data.map((item) => ({
                                        value: item.id,
                                        label: item.capital,
                                    }))}
                                    placeholder="Sélectionnez une ville..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Longueur" name="longueur">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Largeur" name="largeur">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Hauteur" name="hauteur">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Surface du sol" name="surface_sol">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Surface des murs" name="surface_murs">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Mètres linéaires" name="metres_lineaires">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Type bâtiment" name="type_batiment">
                                <Select placeholder="Sélectionnez un type de bâtiment...">
                                    <Option value="bureaux">Bureaux</Option>
                                    <Option value="entrepot">Entrepôt</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                        <Form.Item
                                label="Entrepot"
                                name="statut_batiment"
                                rules={[{ required: true, message: 'Veuillez entrer le status batiment !' }]}
                            >
                                <Select
                                    showSearch
                                    options={types?.map((item) => ({
                                        value: item.id_status_batiment,
                                        label: item.nom_status_batiment,
                                    }))}
                                    placeholder="Sélectionnez le status batiment..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                            {idBatiment ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </Form.Item>
                </Form>

                <Modal
                    title="Confirmer la soumission"
                    open={isModalVisible}
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
