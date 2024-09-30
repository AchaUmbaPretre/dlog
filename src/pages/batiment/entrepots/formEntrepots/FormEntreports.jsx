import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import './formEntreports.css';
import { postEntrepot } from '../../../../services/batimentService';
import { getStatutBin, getTypeBin } from '../../../../services/typeService';

const FormEntrepots = ({idBatiment,closeModal}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState([]);
    const [status, setStatus] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const [typeResponse,statusResponse] = await Promise.all([
              getTypeBin(),
              getStatutBin()
            ]);

            setType(typeResponse.data);
            setStatus(statusResponse.data)

          } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              description: 'Une erreur est survenue lors du chargement des données.',
            });
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);

    const onFinish = async (values) => {
        setLoading(true);
        const value = {
            id_batiment: idBatiment,
            ...values
        }
        try {
            // Remplacez par votre URL d'API
            await postEntrepot(value)
            notification.success({
                message: 'Succès',
                description: 'Entrepôt créé avec succès.',
            });
            closeModal();
            form.resetFields();
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
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Créer Entrepôt
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FormEntrepots;
