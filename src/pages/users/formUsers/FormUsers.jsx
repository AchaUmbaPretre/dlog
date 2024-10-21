import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, notification } from 'antd';
import { getUserOne, postUser, putUser } from '../../../services/userService';

const { Option } = Select;

const FormUsers = ({userId, close, fetchData}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData] = await Promise.all([
                    getUserOne(userId)
                ]);
                    const { data: user } = usersData;
                form.setFieldsValue(user[0]);
    
            } catch (error) {
                console.log(error)
            }
        };
    
        fetchData();
    }, [userId, form])
    

  const onFinish = async(values) => {
    setIsLoading(true);
        try {
            if(userId) {
                await putUser(userId, values)
                notification.success({
                    message: 'Succès',
                    description: 'Les informations ont été Modifiées avec succès.',
                });
            }
            else{
                await postUser(values);
                notification.success({
                    message: 'Succès',
                    description: 'Les informations ont été enregistrées avec succès.',
                });
            }
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
    <div className='controle_form'>
      <div className="controle_title_rows">
        <h2 className='controle_h2'>{ userId ? 'Modifier un utilisateur' : 'Créer un Utilisateur'}</h2>                
      </div>
      <div className="controle_wrapper">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: 'Owner' }}
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
            {
              !userId  &&
              <Col span={12}>
              <Form.Item
                label="Mot de Passe"
                name="mot_de_passe"
                rules={[{ required: false, message: 'Le mot de passe n/est obligatoire' }]}
              >
                <Input.Password placeholder="Entrez le mot de passe" />
              </Form.Item>
            </Col>
            }
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
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isLoading} disabled={isLoading}>
              { userId ? "Modifier" : "Créer l'Utilisateur"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default FormUsers;
