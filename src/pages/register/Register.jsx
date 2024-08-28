import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import './register.scss';

const Register = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className="register">
      <div className="register_wrapper">
        <div className="register_header">
          <h2>Créer un compte</h2>
        </div>
        <Form
          name="register_form"
          className="register_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Veuillez entrer votre nom !' }]}
          >
            <Input
              prefix={<UserOutlined className="site_form_item_icon" />}
              placeholder="Nom"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Veuillez entrer votre email!' }]}
          >
            <Input
              prefix={<MailOutlined className="site_form_item_icon" />}
              placeholder="Adresse email"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe !' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site_form_item_icon" />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe !' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Les deux mots de passe que vous avez saisis ne correspondent pas !');
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site_form_item_icon" />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="register_form_button" size="large" block>
              Registre
            </Button>
          </Form.Item>
        </Form>
        <div className="register_footer_note">
          Vous avez déjà un compte ? <a href="/login">Connectez-vous ici</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
