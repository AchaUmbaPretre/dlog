import React from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import { useState } from 'react';
import { postFournisseur } from '../../../services/fournisseurService';

const { TextArea } = Input;

const FournisseurForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true); 
    try {
      await postFournisseur(values);
      notification.success({
        message: 'Succès',
        description: 'Le fournisseur a été enregistré avec succès.',
      });
      form.resetFields();
      window.location.reload();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Erreur lors de l\'enregistrement du fournisseur.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        date_ajout: new Date(),
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="nom_fournisseur"
            label="Nom du Fournisseur"
            rules={[{ required: true, message: 'Veuillez entrer le nom du fournisseur' }]}
          >
            <Input placeholder="Nom du fournisseur" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="telephone"
            label="Téléphone"
          >
            <Input placeholder="Téléphone" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Veuillez entrer un email valide' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="pays"
            label="Pays"
          >
            <Input placeholder="Pays" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ville"
            label="Ville"
          >
            <Input placeholder="Ville" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="adresse"
            label="Adresse"
          >
            <TextArea rows={4} placeholder="Adresse" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FournisseurForm;
