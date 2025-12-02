import { useEffect, useState } from 'react'
import { Col, Form, notification, Input, Row, Select, Skeleton, Button, Divider, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { getMarqueGenerateur, postModeleGenerateur } from '../../../../../../services/generateurService';

const FormModeleGen = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [marque, setMarque] = useState([]);
    const [loading, setLoading] = useState(false);
    
    
    useEffect(()=> {
        const fetchData = async() => {
            try {
                const { data } = await getMarqueGenerateur();
                setMarque(data)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingData(false);
            }
        }
        fetchData()
    }, [])

    const onFinish = async (values) => {
        const loadingKey = 'loadingModèle';
    
        try {
            await form.validateFields();
            message.loading({
                content: 'Traitement en cours, veuillez patienter...',
                key: loadingKey,
                duration: 0,
            });
    
            setLoading(true);
    
            await postModeleGenerateur(values);
    
            message.success({
                content: 'Le modèle a été enregistré avec succès.',
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
                <h2 className="controle_h2">ENREGISTRER UN MODELE DES GENERATEURS</h2>
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
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="nom_modele"
                                label="Modèle"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir un modèle...',
                                    }
                                ]}
                            >
                                {loadingData ? <Skeleton.Input active={true} /> : <Input size='large' placeholder="Saisir le modèle..." style={{width:'100%'}}/>}
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="id_marque_generateur"
                                label="Marque"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir une marque...',
                                    }
                                ]}
                            >
                                {loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    size='large'
                                    showSearch
                                    options={marque.map((item) => ({
                                        value: item.id_marque_generateur                                           ,
                                        label: `${item.nom_marque}`,
                                    }))}
                                    placeholder="Sélectionnez une marque..."
                                    optionFilterProp="label"
                                />}
                            </Form.Item>
                        </Col>

                        <Button type="primary" size='large' htmlType="submit" icon={<SendOutlined />}>
                            Soumettre
                        </Button>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default FormModeleGen;