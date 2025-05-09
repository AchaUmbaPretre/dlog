import React, { useEffect, useState } from 'react'
import { Col, Form, notification, InputNumber, Row, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { getDeclarationOne, putDeclarationTotalEntrep } from '../../../../../services/templateService';

const RapportTemplateModify = ({closeModal, fetchData, idDeclaration}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        const fetchDatas = async() => {
            const { data : d} = await getDeclarationOne(idDeclaration)
            if(d && d[0]){
                form.setFieldsValue({
                    total_entreposage: d[0].total_entreposage
                })
            }
        } 

        fetchDatas();

    }, [idDeclaration])
    
    const onFinish = async (values) => {
        const loadingKey = 'updateTotalEntreposage';
    
        setLoading(true);
    
        message.loading({
            content: 'Mise à jour en cours, veuillez patienter...',
            key: loadingKey,
            duration: 0,
        });
    
        try {
            await putDeclarationTotalEntrep(idDeclaration, values);
    
            message.success({
                content: 'Le total d’entreposage a été mis à jour avec succès.',
                key: loadingKey,
            });
    
            form.resetFields();
            fetchData();
            closeModal();
    
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
    
            const errorMessage = error?.response?.data?.error || "Une erreur inattendue est survenue. Veuillez réessayer.";
    
            message.error({
                content: 'Échec de la mise à jour.',
                key: loadingKey,
            });
    
            notification.error({
                message: 'Erreur de traitement',
                description: errorMessage,
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
                <h2 className="controle_h2">METTRE A JOUR LE TOTAL ENTREPOSAGE</h2>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    name="chauffeurForm"
                    layout="vertical"
                    autoComplete="off"
                    className="custom-form"
                    onFinish={onFinish}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={24}>
                            <Form.Item
                                name="total_entreposage"
                                label="Total"
                                rules={[{ required: true, message: "Veuillez entrer le total" }]}
                            >
                                <InputNumber size='large' placeholder="Saisir la marque..." style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Button type="primary" disabled={loading} loading={loading} size='large' htmlType="submit" icon={<SendOutlined />}>
                            Modifier
                        </Button>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default RapportTemplateModify;