import { Button, Form, Input, notification, Modal } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postCategorie } from '../../../services/typeService';


const CatForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formValues, setFormValues] = useState({});

    const showConfirm = (values) => {
        setFormValues(values); 
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);
        setIsLoading(true);
        try {
            await postCategorie(formValues);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            navigate('/categorie');
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
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>{ idTache ? 'Modifier une tâche' : idProjet ? `Insérer une nouvelle tache dans le projet ${projetName}` : 'Ajouter une nouvelle tâche'}</h2>                
            </div>
            <div className="controle_wrapper">
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Categorie"
                        name="nom_cat"
                        rules={[{ required: true, message: 'Veuillez entrer le nom de categorie !' }]}
                    >
                        <Input />
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

export default CatForm;
