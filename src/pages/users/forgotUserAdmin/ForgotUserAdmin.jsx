import React, { useEffect, useState } from 'react';
import { Form, Input, Menu, Button, message, Row, Col, notification } from 'antd';
import { getUserOne } from '../../../services/userService';
import forgot from './../../../assets/reset.png';
import './forgotUserAdmin.scss'
import { passwordReset } from '../../../services/authService';

const ForgotUserAdmin = ({userId, closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData] = await Promise.all([
                    getUserOne(userId),
                ]);

                const { data: user } = usersData; 
                setData(user)   
            } catch (error) {
                console.log(error)
            }
        };
  
        fetchData();
    }, [userId, form])

    const onFinish = async (values) => {
        setIsLoading(true);
        const loadingKey = 'loading';
      
        try {
          await form.validateFields();
      
          message.loading({
            content: 'Traitement en cours, veuillez patienter...',
            key: loadingKey,
            duration: 0
          });
      
          await passwordReset(userId, values);
      
          message.success({
            content: "Mot de passe mis à jour avec succès.",
            key: loadingKey
          });
      
          form.resetFields();
      
          fetchData();
          closeModal();
      
        } catch (error) {
          console.error('Erreur lors de la mise à jour du mot de passe :', error);
      
          notification.error({
            message: 'Erreur de mise à jour',
            description: "Une erreur est survenue lors de l'enregistrement du mot de passe.",
          });
      
        } finally {
          setIsLoading(false);
        }
      };      
           
  return (
    <div className='forgot_user'>
        <div className="forgot_user_rows">
        <h2 className="forgot_user_h2">Mise à jour du mot de passe</h2>
        </div>

      <div className="forgot_wrapper">
        <div className="forgot_left">
            <img src={forgot} alt="Password recovery" className="reset_img" />
        </div>

        <div className="forgot_right">
            <div className="forgot_user_name">
                <span className="forgot_span">NOM : <strong>{data[0]?.nom.toUpperCase()}</strong></span>
                <span className="forgot_span">EMAIL : <strong>{data[0]?.email.toUpperCase()}</strong></span>
            </div>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
            <Row gutter={16}>
                <Col span={24}>
                <Form.Item
                    label="Mot de Passe"
                    name="password"
                    rules={[{ required: false, message: 'Le mot de passe n/est obligatoire' }]}
                >
                    <Input.Password placeholder="Entrez le mot de passe" />
                </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isLoading} disabled={isLoading}>
                Modifier
                </Button>
            </Form.Item>
            </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotUserAdmin;
