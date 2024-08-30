import { Button, Form, Input, message, notification, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postDepartement } from '../../../services/departementService';
import { getUser } from '../../../services/userService';

const { Option } = Select;

const DepartementForm = () => {
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
        const fetchData = async () => {
          try {
            const { data } = await getUser();
            setData(data);
          } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              description: 'Une erreur est survenue lors du chargement des données.',
            });
          }
        };
    
        fetchData();
      }, []);

    const handleOk = async () => {
        setIsModalVisible(false);
        setIsLoading(true);
        try {
            await postDepartement(formValues);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            navigate('/departement');
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
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Nom de département"
                        name="nom_departement"
                        rules={[{ required: true, message: 'Veuillez entrer le nom de département !' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: false, message: 'Veuillez entrer la description !' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Téléphone"
                        name="telephone"
                        rules={[{ required: false, message: 'Veuillez entrer le téléphone !' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ type: 'email', message: 'Veuillez entrer une adresse email valide !' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Responsable"
                        name="responsable"
                        rules={[{ required: false, message: 'Veuillez entrer le nom du responsable !' }]}
                    >
                        <Select >
                            {data.map((chef) => (
                                <Option key={chef.id_utilisateur} value={chef.id_utilisateur}>
                                    {chef.nom}
                                </Option>
                            ))}
                        </Select>
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

export default DepartementForm;
