import { useEffect, useState } from 'react'
import { Col, Form, Card, notification, Input, Row, Select, Skeleton, Button, message } from 'antd';
import { SendOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getLocaliteOne, getVille, postLocalite, putLocalite } from '../../../../services/transporteurService';

const DemandeVehiculeForm = ({closeModal, fetchData, localiteId}) => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [ville, setVille] = useState([]);
    const [loading, setLoading] = useState(false);
    
        useEffect(()=> {
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
    
            if (localiteId) {
                await postLocalite(values);
        
                message.success({
                    content: 'La localité a été enregistré avec succès.',
                    key: loadingKey,
                });
            } else {
                const valuesUpdate = {
                    ...values,
                    id_localite: localiteId
                }
                await putLocalite(valuesUpdate)
            }
    
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
                                    name="nom_localite"
                                    label="Nom"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Veuillez fournir le nom d'une localité...",
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input  placeholder="Saisir..." style={{width:'100%'}}/>}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24}>
                                <Form.Item
                                    name="id_ville"
                                    label="Ville"
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
                                        options={ville.map((item) => ({
                                            value: item.id_ville,
                                            label: `${item.nom_ville}`,
                                        }))}
                                        placeholder={
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
                                                Sélectionnez une ville...
                                            </span>
                                        }
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

export default DemandeVehiculeForm;