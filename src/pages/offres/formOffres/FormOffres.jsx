
import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { postOffre } from '../../../services/offreService';

const FormOffres = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // État de chargement

  const handleSubmit = async (values) => {
    setLoading(true); // Démarrer le chargement
    try {
      await postOffre(values);
      notification.success({
        message: 'Succès',
        description: 'L\'offre a été enregistrée avec succès.',
      });
      form.resetFields();
      window.location.reload();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement de l\'offre.',
      });
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <Form
      form={form}
      initialValues={{
        // initialValues peut être défini ici si nécessaire
      }}
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item
        label="Nom de l'offre"
        name="nom_offre"
        rules={[{ required: true, message: 'Veuillez entrer le nom de l\'offre.' }]}
      >
        <Input placeholder="Nom de l'offre" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
      >
        <Input.TextArea rows={4} placeholder="Description de l'offre" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Enregistrer
        </Button>
        <Button
          style={{ marginLeft: '10px' }}
          onClick={() => form.resetFields()}
        >
          Annuler
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormOffres;
