import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, notification } from 'antd';
import axios from 'axios';
import { postBureau } from '../../../../services/batimentService';
import { useNavigate } from 'react-router-dom';

const BureauForm = ({idBatiment, closeModal}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const onFinish = async (values) => {
    setIsLoading(true)
    const value = {
        id_batiment : idBatiment,
        ...values
    }

    try {
      const response = await postBureau(value)
      if (response.status === 200) {
        notification.success({
          message: 'Succès',
          description: 'Le bureau a été ajouté avec succès!',
        });
        form.resetFields();
        closeModal()
        navigate('/liste_bureaux')
      }
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Une erreur est survenue lors de l\'ajout du bureau.',
      });
    }
    finally {
        setIsLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >

      <Form.Item
        label="Nom du Bureau"
        name="nom"
        rules={[{ required: true, message: 'Veuillez entrer le nom du bureau' }]}
      >
        <Input placeholder="Nom du bureau" />
      </Form.Item>

      <Form.Item
        label="Longueur (m)"
        name="longueur"
        rules={[{ required: true, message: 'Veuillez entrer la longueur du bureau' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Longueur en mètres" />
      </Form.Item>

      <Form.Item
        label="Largeur (m)"
        name="largeur"
        rules={[{ required: true, message: 'Veuillez entrer la largeur du bureau' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Largeur en mètres" />
      </Form.Item>

      <Form.Item
        label="Hauteur (m)"
        name="hauteur"
        rules={[{ required: true, message: 'Veuillez entrer la hauteur du bureau' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Hauteur en mètres" />
      </Form.Item>

      <Form.Item
        label="Nombre de postes"
        name="nombre_postes"
        rules={[{ required: true, message: 'Veuillez entrer le nombre de postes' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Nombre de postes" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isLoading} disabled={isLoading}>
          Ajouter Bureau
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BureauForm;
