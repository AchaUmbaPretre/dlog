import { useState } from 'react'
import { Form, Row, Card, Col, message, Input, notification, Button, DatePicker } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { postRetourVehicule } from '../../../../services/charroiService';

const RetourVehiculeForm = ({closeModal, fetchData, id_demande_vehicule}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

      const onFinish = async (values) => {
        await form.validateFields();
            
        const loadingKey = 'loadingDemandeVehicule';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
            
        setLoading(true); 
    
        try {

            const v = {
                ...values,
                user_cr : userId,
                id_demande: id_demande_vehicule
            }
            await postRetourVehicule(v);
            message.success({ content: 'Le retour du véhicule a été enregistré avec succès.', key: loadingKey });
            
            form.resetFields();
            fetchData();
            closeModal();
        } catch (error) {
          notification.error({
            message: 'Erreur',
            description: 'Erreur lors de l\'enregistrement de demande.',
          });
        } finally {
          setLoading(false);
        }
      };
    

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">Formulaire de retour</h2>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                     <Card>
                        <Row gutter={12}>
                            <Col xs={24} md={24}>
                                <Form.Item
                                    label="Date & heurre de retour"
                                    name="date_retour"
                                    rules={[{ required: true, message: "Veuillez fournir la date et l'heure"}]}
                                >
                                    <DatePicker 
                                        style={{width:'100%'}}
                                        showTime={{ format: 'HH:mm' }} 
                                        format="YYYY-MM-DD HH:mm" 
                                        placeholder="Choisir date et heure" 
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24}>
                                <Form.Item
                                    label="Commentaire"
                                    name="commentaire"
                                >
                                    <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'85px'}}/>
                                </Form.Item>
                            </Col>

                            <div style={{ marginTop: '20px' }}>
                                <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} disabled={loading} >
                                    Soumettre
                                </Button>
                            </div>
                        </Row>
                     </Card>
                </Form>
            </div>
        </div>
    </>
  )
}

export default RetourVehiculeForm