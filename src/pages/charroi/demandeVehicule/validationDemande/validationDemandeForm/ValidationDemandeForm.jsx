import { useEffect, useState } from 'react'
import { Form, Card, Row, Col, Select, DatePicker } from 'antd';
import { getUser } from '../../../../../services/userService';


const ValidationDemandeForm = () => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ validateur, setValidateur ] = useState([]);

    const fetchData = async () => {
        try {
            const [ userData ] = await Promise.all([
                getUser()
            ])
            setValidateur(userData.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=> {
        fetchData();
    }, [])

    const onFinish = async (values) => {
        await form.validateFields();
        const loadingKey = 'loadingValidationDemande';

    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Validation de demande</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Card>
                        <Row gutter={12}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Validateur"
                                    name="validateur_id"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un validateur' }]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        options={validateur?.map((item) => ({
                                            value: item.id_utilisateur,
                                            label: `${item.prenom}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Date validation"
                                    name="date_validation"
                                    rules={[{ required: false, message: "Veuillez fournir la date et l'heure"}]}
                                >
                                    <DatePicker 
                                        style={{width:'100%'}}
                                        showTime={{ format: 'HH:mm' }} 
                                        format="YYYY-MM-DD HH:mm" 
                                        placeholder="Choisir date et heure" 
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </div>
        </div>
    </>
  )
}

export default ValidationDemandeForm