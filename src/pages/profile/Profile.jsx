import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Avatar, notification, Upload } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Pour Ant Design v5

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Simuler un appel API pour mettre à jour les informations
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: 'Informations mises à jour',
        description: 'Vos informations ont été mises à jour avec succès.',
      });
      form.resetFields(); // Réinitialise le formulaire après la soumission
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px'}}>
      <Card style={{ padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>Mon Profil</Title>
        
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          
          {/* Colonne des informations utilisateur */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              style={{ marginBottom: '20px', border: '2px solid #1890ff' }}
            />
            <div>
              <Text strong>Nom :</Text>
              <Text> John Doe</Text>
            </div>
            <div style={{ marginTop: '10px' }}>
              <Text strong>Email :</Text>
              <Text> john.doe@example.com</Text>
            </div>
            <div style={{ marginTop: '10px' }}>
              <Text strong>Mot de passe :</Text>
              <Text> ********</Text>
            </div>
          </div>

          {/* Colonne pour modifier les informations */}
          <div style={{ flex: 1 }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="name"
                label="Nom"
                rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
              >
                <Input placeholder="Entrez votre nom" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Veuillez entrer votre email' }, { type: 'email', message: 'Email invalide' }]}
              >
                <Input placeholder="Entrez votre email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mot de passe"
                rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
              >
                <Input.Password placeholder="Entrez votre mot de passe" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                  Mettre à jour
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
