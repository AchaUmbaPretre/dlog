import { useState } from 'react'
import { Col, Form, Card, notification, Input, Row, Skeleton, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const PaysForm = ({closeModal, fetchData, localiteId}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
/*         useEffect(()=> {
            const fetchData = async() => {
                try {
                    const { data } = await getVille();
                    setVille(data)

                    if(localiteId) {
                        const { data : d } = await getLocaliteOne(localiteId);
                        form.setFieldsValue({
                            nom_localite : d[0]?.nom_localite,
                            id_ville: d[0]?.id_ville
                        })
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoadingData(false);
                }
            }

            fetchData()
        }, [localiteId]) */

    const onFinish = async (values) => {
        const loadingKey = 'loadingLocalité';
    
        try {
            await form.validateFields();
            message.loading({
                content: 'Traitement en cours, veuillez patienter...',
                key: loadingKey,
                duration: 0,
            });
    
            setLoading(true);

    
            form.resetFields();
            fetchData();
            closeModal();
    
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du modèle :", error);
    
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
                <h2 className="controle_h2">{localiteId ? 'MODIFIER' : 'ENREGISTRER' } UNE LOCALITE</h2>
            </div>
            <Card>
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
                                    name="nom_localite"
                                    label="Nom"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Veuillez fournir le nom d'une localité...",
                                        }
                                    ]}
                                >
                                    <Input  placeholder="Saisir..." style={{width:'100%'}}/>
                                </Form.Item>
                            </Col>

                            <Button size='middle' style={{marginTop:'10px'}} type="primary" loading={loading} disabled={loading} htmlType="submit" icon={<SendOutlined />}>
                                { localiteId ? 'Modifier' : 'Soumettre'}
                            </Button>
                        </Row>
                    </Form>
                </div>
            </Card>
        </div>
    </>
  )
}

export default PaysForm;