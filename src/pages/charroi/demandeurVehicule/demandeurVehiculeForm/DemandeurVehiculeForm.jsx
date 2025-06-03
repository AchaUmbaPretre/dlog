import { useEffect, useState } from 'react'
import { Col, Form, Card, notification, Input, Row, Select, Skeleton, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { getDepartement } from '../../../../services/departementService';
import { postServiceDemandeur } from '../../../../services/charroiService';

const DemandeurVehiculeForm = ({closeModal, fetchData, localiteId}) => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [departement, setDepartement] = useState([]);
    const [loading, setLoading] = useState(false);
    
        useEffect(()=> {
            const fetchData = async() => {
                try {
                    const { data } = await getDepartement();
                    setDepartement(data)

                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoadingData(false);
                }
            }

            fetchData()
        }, [localiteId])

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

            await postServiceDemandeur(values);
        
            message.success({
                content: 'Le demandeur a été enregistré avec succès.',
                key: loadingKey,
            });
    
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
                <h2 className="controle_h2">Formulaire des demandeurs</h2>
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
                                    name="nom_service"
                                    label="Nom"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Veuillez fournir le nom un service...",
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input  placeholder="Saisir..." style={{width:'100%'}}/>}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24}>
                                <Form.Item
                                    name="id_departement"
                                    label="Département"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir une ville...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={departement.map((item) => ({
                                            value: item.id_departement,
                                            label: `${item.nom_departement}`,
                                        }))}
                                        placeholder= 'Sélectionnez un département..'
                                        optionFilterProp="label"
                                    />
                                    }
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

export default DemandeurVehiculeForm;