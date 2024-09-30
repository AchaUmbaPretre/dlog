import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, notification } from 'antd';
import axios from 'axios';

const BureauForm = () => {
  const [form] = Form.useForm();

  // Fonction de soumission du formulaire
  const onFinish = async (values) => {
    try {
      // Effectuer l'appel API pour l'insertion dans la base de données
      const response = await axios.post('/api/bureaux', values); // Modifiez l'URL selon votre API
      if (response.status === 200) {
        notification.success({
          message: 'Succès',
          description: 'Le bureau a été ajouté avec succès!',
        });
        form.resetFields(); // Réinitialiser le formulaire après la soumission
      }
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Une erreur est survenue lors de l\'ajout du bureau.',
      });
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
        label="ID Bâtiment"
        name="id_batiment"
        rules={[{ required: true, message: 'Veuillez entrer l\'ID du bâtiment' }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

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
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Ajouter Bureau
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BureauForm;
