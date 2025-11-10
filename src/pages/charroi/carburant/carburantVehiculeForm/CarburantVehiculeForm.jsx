import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col
} from 'antd';

const CarburantVehiculeForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState({ data: false, submit: false });

    const handleSubmit = async (values) => {

    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">Enregistrer un nouveau vehicule ou groupe electrogene</h2> 
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    disabled={loading}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Form.Item label="Marque" name="nom_marque">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Form.Item label="Modèle" name="nom_modele">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Form.Item label="N° série" name="num_serie">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Form.Item label="Immatriculation" name="immatriculation">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Row justify="end" style={{ marginTop: 20 }}>
                            <Col>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading.submit}
                                    disabled={loading.data}
                                >
                                    Enregistrer
                                </Button>
                            </Col>
                        </Row>
                    </Row>    
                </Form>  
            </div>
        </div>
    </>
  )
}

export default CarburantVehiculeForm