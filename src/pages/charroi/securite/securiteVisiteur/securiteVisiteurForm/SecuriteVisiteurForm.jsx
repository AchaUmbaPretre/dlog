import { useState } from 'react'
import { Form, Input, message, notification, Row, Col, Button } from 'antd';
import { postVisiteurVehicule } from '../../../../../services/charroiService';
import { useSelector } from 'react-redux';

const SecuriteVisiteurForm = ({closeModal}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    const onFinish = async (values) => {
        setLoading(true);
        const loadingKey = 'loadingVisiteur';

        try {
            const value = {
                ...values,
                user_cr : userId
            }
            message.loading({ content: 'En cours...', key: loadingKey });
            await postVisiteurVehicule(value)
            message.success({
                content: "Le visiteur été enregistré avec succès.",
                key: loadingKey,
            });

            form.resetFields();
            closeModal();
        } catch (error) {
            console.error("Erreur lors de l'ajout d'un visiteur :", error);
            notification.error({
                message: 'Erreur',
                description: error.response?.data?.error || 'Une erreur inconnue s\'est produite.',
            });
        } finally {
            setLoading(false);
        }
    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>Enregistrer un visiteur</h2>                
            </div>
            <div className="controle_wrapper">
                <Form 
                    layout="vertical" 
                    onFinish={onFinish} 
                    form={form} 
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Matricule"
                                name="immatriculation"
                                rules={[{ required: false, message: 'Le site est requis' }]}
                            >
                                <Input placeholder="Ex:3FB21..."  />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Chauffeur"
                                name="nom_chauffeur"
                                rules={[{ required: false, message: 'Le site est requis' }]}
                            >
                                <Input placeholder="Entrer le nom du chauffeur..."  />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Motif"
                                name="motif"
                            >
                                <Input.TextArea placeholder="Entrer le motif..." style={{height:"80px", resize:'none'}} />
                            </Form.Item>
                        </Col>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>Enregistrer</Button>
                        </Form.Item>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default SecuriteVisiteurForm