import React, { useEffect, useState } from 'react'
import { Form, Row, Divider, Card, Col, Upload, message, notification, InputNumber, Skeleton, Select, Button, Input, DatePicker } from 'antd';
import { getLocalisation } from '../../../../services/transporteurService';


const TrajetForm = () => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [local, setLocal] = useState([]);

    const fetchData = async () => {
        const [locaData] = await Promise.all([
            getLocalisation()
        ])
        setLocal(locaData.data)
    }

    useEffect(()=> {
        fetchData();
    }, [])

    const onFinish = async(values) => {
        await form.validateFields();
        const loadingKey = 'loadingReparation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        setLoading(true);
        try {
            
        } catch (error) {
            
        }  
    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Enregistrer un trajet</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Départ"
                                name="id_depart"
                                rules={[{ required: true, message: 'Veuillez sélectionner un ' }]}
                            >

                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default TrajetForm