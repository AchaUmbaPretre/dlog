import React, { useEffect, useState } from 'react'
import { Col, Form, notification, InputNumber, Skeleton, Row, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { getDeclarationOne, putDeclarationTotalEntrep } from '../../../../../services/templateService';

const RapportTemplateModify = ({closeModal, fetchData, idDeclaration}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [desc, setDesc] = useState(null);
   
    useEffect(() => {
        const fetchDatas = async () => {
            try {
                const { data } = await getDeclarationOne(idDeclaration);

                setDesc(data[0].desc_template)

                if (Array.isArray(data) && data.length > 0 && data[0]?.total_entreposage != null) {
                    form.setFieldsValue({
                        total_entreposage: data[0].total_entreposage,
                    });
                } else {
                    form.setFieldsValue({
                        total_entreposage: 0,
                    });
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données :', error);
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Impossible de récupérer les données de la déclaration.',
                    placement: 'topRight',
                });
            } finally {
                setIsFetching(false);
            }
        };

        if (idDeclaration) {
            fetchDatas();
        }
    }, [idDeclaration, form]);
    
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
            <h2 className="controle_h2">METTRE À JOUR LE TOTAL D’ENTREPOSAGE {desc?.toUpperCase()}</h2>
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
                            {isFetching ? (
                                <Skeleton active paragraph={false} />
                            ) : (
                                <Form.Item
                                    name="total_entreposage"
                                    label="Total"
                                    rules={[{ required: true, message: "Veuillez entrer le total" }]}
                                >
                                    <InputNumber size='large' placeholder="ex: 1000" style={{ width: '100%' }} />
                                </Form.Item>
                            )}
                        </Col>

                        <Button type="primary" disabled={loading || isFetching} loading={loading} size='large' htmlType="submit" icon={<SendOutlined />}>
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