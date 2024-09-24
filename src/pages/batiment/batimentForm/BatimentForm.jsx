import { Button, Form, Input, notification, Modal, Select } from 'antd';
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
                    <Form.Item
                        label="Nom"
                        name="nom_batiment"
                        rules={[{ required: true, message: 'Veuillez entrer le nom du batiment!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Site"
                        name="site"
                        rules={[{ required: false, message: 'Veuillez entrer le nom du site!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Ville"
                        name="ville"
                        rules={[{ required: true, message: 'Veuillez entrer le nom de la ville!' }]}
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
