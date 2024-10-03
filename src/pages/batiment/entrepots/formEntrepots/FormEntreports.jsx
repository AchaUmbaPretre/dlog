import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import './formEntreports.css';
import { postEntrepot } from '../../../../services/batimentService';
import { useNavigate } from 'react-router-dom';

const FormEntrepots = ({idBatiment,closeModal,fetchData,id_entrepot}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        const value = {
            id_batiment: idBatiment,
            ...values
        }
        try {
            await postEntrepot(value)
            notification.success({
                message: 'Succès',
                description: 'Entrepôt créé avec succès.',
            });
            closeModal();
            form.resetFields();
            fetchData();
            navigate('/liste_entrepot')
            window.location.reload();
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Erreur lors de la création de l\'entrepôt.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>{id_entrepot ? "Modifier l'entrepôt" : 'Créer un nouvel entrepôt'}</h2>                
            </div>
            <Form
                form={form}
                name="warehouseForm"
                onFinish={onFinish}
                layout="vertical"
                className="warehouse-form"
            >
                <Form.Item
                    label="Nom"
                    name="nom"
                    rules={[{ required: true, message: 'Veuillez entrer le nom de l\'entrepôt' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                       {id_entrepot ? 'mise à jour': 'Créer Entrepôt'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FormEntrepots;
