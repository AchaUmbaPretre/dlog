import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './passwordForgot.scss';
import forgot from './../../assets/rb_1123.png';

const { Title, Paragraph } = Typography;

const PasswordForgot = () => {
  const onFinish = (values) => {
    console.log('Email:', values.email);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot_password">
        <div className="forgot_left">
          <img src={forgot} alt="Password recovery" className='forgot_img' />
        </div>
        <div className="forgot_right">
          <div className="forgot_content">
            <Title level={2} className="forgot_title">Mot de passe oublié?</Title>
            <Paragraph className="forgot_description">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </Paragraph>
            <Form
              name="forgot_password"
              onFinish={onFinish}
              layout="vertical"
              className="forgot_form"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Veuillez entrer votre email!' },
                  { type: 'email', message: 'Adresse email invalide!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Entrez votre email"
                  size="large"
                  className="forgot_input"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" className="forgot_button">
                  Envoyer le lien
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordForgot;
