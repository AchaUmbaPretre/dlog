import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import forgot from './../../assets/reset.png';
import './passwordReset.scss'

const { Title, Paragraph } = Typography;

const PasswordReset = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Mot de passe réinitialisé avec succès!');
      console.log('New Password:', values.password);
    }, 1500);
  };

  return (
    <div className="password-reset-container">
      <div className="password_reset">
        <div className="reset_left">
          <img src={forgot} alt="Password recovery" className="reset_img" />
        </div>
        <div className="reset_right">
          <div className="reset_content">
            <Title level={2} className="reset_title">Réinitialisez votre mot de passe</Title>
            <Paragraph className="reset_description">
              Veuillez entrer votre nouveau mot de passe pour réinitialiser votre compte.
            </Paragraph>
            <Form
              name="password_reset"
              onFinish={onFinish}
              layout="vertical"
              className="reset_form"
            >
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Veuillez entrer votre nouveau mot de passe!' },
                  { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  size="large"
                  className="reset_input"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  className="reset_button"
                  loading={loading}
                >
                  Réinitialiser le mot de passe
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
