import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, notification } from 'antd';
import { getUserOne } from '../../../services/userService';
import forgot from './../../../assets/reset.png';
import './forgotUserAdmin.scss'

const ForgotUserAdmin = ({userId, close, fetchData}) => {
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

  const onFinish = async(values) => {
    setIsLoading(true);
        try {
            
            fetchData();
            close()
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
    <div className='forgot_user'>
      <div className="forgot_user_rows">
        <h2 className='forgot_user_h2'>Mise à jour de mot de passe</h2>                
      </div>
      <div className="forgot_user_name">
        <span className="forgot_span">NOM : {data[0]?.nom.toUpperCase()}</span>
        <span className="forgot_span">EMAIL : {data[0]?.email.toUpperCase()}</span>
        <span className="forgot_span">ROLE : {data[0]?.role.toUpperCase()}</span>

      </div>
      <div className="forgot_wrapper">
        <div className="forgot_left">
            <img src={forgot} alt="Password recovery" className="reset_img" />
        </div>
        <div className="forgot_right">
            <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            >
            <Row gutter={16}>
                <Col span={24}>
                <Form.Item
                    label="Mot de Passe"
                    name="mot_de_passe"
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
