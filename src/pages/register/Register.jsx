import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import './register.scss';
import { register } from '../../redux/apiCalls';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      await register(dispatch, values);
      notification.success({
        message: 'Succès',
        description: 'Enregistrement réussi !',
      });
      navigate('/login');
      window.location.reload();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Erreur lors de l'enregistrement.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
              placeholder="Mot de passe"
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
                  return Promise.reject(new Error('Les deux mots de passe que vous avez saisis ne correspondent pas !'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site_form_item_icon" />}
              placeholder="Confirmez le mot de passe"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register_form_button"
              size="large"
              block
              loading={isLoading}
            >
              S'inscrire
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
