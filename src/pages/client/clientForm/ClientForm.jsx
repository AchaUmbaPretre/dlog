import { Button, Form, Input, notification, Select, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import './ClientForm.scss';
import { useNavigate } from 'react-router-dom';
import { getClient_type, getClientOne, getProvince, postClient, putClient } from '../../../services/clientService';


const ClientForm = ({closeModal, idClient, fetchData }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchProvince = async () => {
            try {
                const response = await getProvince();
                setProvinces(response.data);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des provinces.',
                });
            }
        };

        fetchProvince();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getClient_type();
                setTypes(response.data);
            } catch (error) {
                console.log(error)
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchOne = async () => {
            try {
                const response = await getClientOne(idClient);
                form.setFieldsValue(response.data[0])
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des types de client.',
                });
            }
        };

        fetchOne();
    }, [idClient]);

    useEffect(() => {
        form.resetFields();
      }, [idClient, form]);

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            if(idClient){
                await putClient(idClient, values)
                notification.success({
                    message: 'Succès',
                    description: 'Les informations ont été mise à jour avec succès.',
                });
            }
            else{
                await postClient(values);
                notification.success({
                    message: 'Succès',
                    description: 'Les informations ont été enregistrées avec succès.',
                });
            }
            form.resetFields();
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

    return (
        <div className="client-form-container">
            <div className="client-form-wrapper">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Informations Générales" key="1">
                            <Form.Item
                                label="Nom"
                                name="nom"
                                rules={[{ required: true, message: 'Veuillez entrer le nom du client !' }]}
                            >
                                <Input placeholder="Entrez le nom du client" style={{padding:'10px'}} />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ type: 'email', message: "L'email doit être valide !" }]}
                            >
                                <Input placeholder="Entrez l'email du client" style={{padding:'10px'}} />
                            </Form.Item>

                            <Form.Item
                                label="Téléphone"
                                name="telephone"
                                rules={[{ required: false, message: 'Veuillez entrer le téléphone du client !' }]}
                            >
                                <Input placeholder="Entrez le téléphone du client" style={{padding:'10px'}} />
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Localisation" key="2">
                            <Form.Item
                                label="Ville"
                                name="ville"
                            >
                                <Select
                                    showSearch
                                    options={provinces?.map((item) => ({
                                        value: item.id,
                                        label: item.capital,
                                    }))}
                                    placeholder="Sélectionnez une ville..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Adresse"
                                name="adresse"
                                rules={[{ required: false, message: "Veuillez entrer l'adresse !" }]}
                            >
                                <Input placeholder="Entrez l'adresse..." style={{padding:'10px'}} />
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Type de Client" key="3">
                            <Form.Item
                                label="Type de client"
                                name="id_type_client"
                                rules={[{ required: true, message: 'Veuillez entrer le type du client !' }]}
                            >
                                <Select
                                    showSearch
                                    options={types?.map((item) => ({
                                        value: item.id_type_client,
                                        label: item.nom_type,
                                    }))}
                                    placeholder="Sélectionnez un type..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Actions" key="4">
                            <Form.Item>
                                <Button style={{padding:'10px'}} type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                                    Ajouter
                                </Button>
                            </Form.Item>
                        </Tabs.TabPane>
                    </Tabs>
                </Form>
            </div>
        </div>
    );
};

export default ClientForm;
