import React, { useState } from 'react'
import { Col, Form, notification, Input, Row, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { postTypeGenerateur } from '../../../../../../services/generateurService';

const FormTypeGen = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
        const onFinish = async (values) => {
            const loadingKey = 'loadingMarque';
        
            try {
                await form.validateFields();
                message.loading({
                    content: 'Traitement en cours, veuillez patienter...',
                    key: loadingKey,
                    duration: 0,
                });
        
                setLoading(true);
        
                await postTypeGenerateur(values);
        
                message.success({
                    content: 'Le type des générateurs a été enregistré avec succès.',
                    key: loadingKey,
                });
        
                form.resetFields();
                fetchData();
                closeModal();
        
            } catch (error) {
                console.error("Erreur lors de l'enregistrement de marque :", error);
        
                const errorMsg = error?.response?.data?.error || "Une erreur inconnue est survenue. Veuillez réessayer.";
        
                message.error({
                    content: 'Une erreur est survenue.',
                    key: loadingKey,
                });
        
                notification.error({
                    message: 'Erreur lors de l’enregistrement',
                    description: errorMsg,
                    placement: 'topRight',
                    duration: 6,
                });
        
            } finally {
                setLoading(false);
            }
        };

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">ENREGISTRER UN TYPE DES GENERATEURS</h2>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    name="nom_type_gen"
                    layout="vertical"
                    autoComplete="off"
                    className="custom-form"
                    onFinish={onFinish}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={24}>
                            <Form.Item
                                name="nom_type_gen"
                                label="Nom"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir un type des générateurs...',
                                    }
                                ]}
                            >
                                <Input size='large' placeholder="Saisir..." style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Button type="primary" loading={loading} size='large' htmlType="submit" icon={<SendOutlined />}>
                            Soumettre
                        </Button>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default FormTypeGen;