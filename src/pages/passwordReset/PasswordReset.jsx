import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, notification } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import forgot from './../../assets/reset.png';
import './passwordReset.scss'
import { passwordReset } from '../../services/authService';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const PasswordReset = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const token = path.substring(path.lastIndexOf('/') + 1);
  const navigate = useNavigate();


  const onFinish = async(values) => {

    setIsLoading(true);
        try {

              const response = await passwordReset(token,values);
                notification.success({
                    message: 'Succès',
                    description: response.data.message
                });
                navigate('/login')
            } catch (error) {
                if (error.response) {
                    notification.error({
                        message: 'Erreur',
                        description: error.response.data.error || error.response.data.message, // Récupérer le message d'erreur
                    });
                }
                else {
                    notification.error({
                      message: 'Erreur',
                      description: 'Une erreur est survenue.',
                    });
                  }
            }
             finally {
            setIsLoading(false);
        }
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
                  loading={isLoading}
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
