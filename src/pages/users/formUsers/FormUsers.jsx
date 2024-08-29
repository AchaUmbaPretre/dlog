import React, { useState } from 'react';
import { Form, Input, Button, Select, Row, Col, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { postUser } from '../../../services/userService';

const { Option } = Select;

const FormUsers = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

  const onFinish = async(values) => {
    setIsLoading(true);
        try {
            await postUser(values);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            navigate('/utilisateur');
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2>Créer un Utilisateur</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ role: 'Owner' }} // Définir le rôle par défaut comme 'Owner'
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nom"
              name="nom"
              rules={[{ required: true, message: 'Le nom est obligatoire' }]}
            >
              <Input placeholder="Entrez le nom" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[{ required: false }]}
            >
              <Input placeholder="Entrez le prénom" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: 'email', message: "L'adresse e-mail n'est pas valide" },
                { required: true, message: 'L’email est obligatoire' },
              ]}
            >
              <Input placeholder="Entrez l'adresse e-mail" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Mot de Passe"
              name="mot_de_passe"
              rules={[{ required: true, message: 'Le mot de passe est obligatoire' }]}
            >
              <Input.Password placeholder="Entrez le mot de passe" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Rôle"
              name="role"
              rules={[{ required: true, message: 'Le rôle est obligatoire' }]}
            >
              <Select>
                <Option value="Admin">Admin</Option>
                <Option value="Owner">Owner</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isLoading}>
            Créer l'Utilisateur
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormUsers;
