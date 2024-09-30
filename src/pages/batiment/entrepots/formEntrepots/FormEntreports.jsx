import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import './formEntreports.css';

const FormEntrepots = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Remplacez par votre URL d'API
            await 
            notification.success({
                message: 'Succès',
                description: 'Entrepôt créé avec succès.',
            });
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
                <h2 className='controle_h2'>Créer un Nouvel Entrepôt</h2>                
            </div>
            <Form
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
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Créer Entrepôt
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FormEntrepots;
