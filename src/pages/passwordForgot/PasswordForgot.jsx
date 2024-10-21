import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './passwordForgot.scss'
import forgot from './../../assets/rb_1123.png'

const { Title } = Typography;

const PasswordForgot = () => {
  const onFinish = (values) => {
    console.log('Email:', values.email);
  };

  return (
    <div className="forgot-password-container">
        <div className="forgot_password">
            <div className="forgot_left">
                <img src={forgot} alt="" className='forgot_img' />
            </div>
            <div className="forgot_right">
                    <Title level={5}>Réinitialiser le mot de passe</Title>
                    <Form
                        name="forgot_password"
                        onFinish={onFinish}
                        layout="vertical"
                        style={{ maxWidth: '400px', margin: 'auto' }}
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
                        />
                        </Form.Item>
                        <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Réinitialiser
                        </Button>
                        </Form.Item>
                    </Form>
            </div>
        </div>
    </div>
  );
};

export default PasswordForgot;
