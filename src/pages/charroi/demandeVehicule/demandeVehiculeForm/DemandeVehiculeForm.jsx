import React, { useEffect, useState } from 'react'
import { Form, Row, Divider, Card, Col, message, notification, InputNumber, Skeleton, Select, Button, Input, DatePicker } from 'antd';


const DemandeVehiculeForm = () => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ loadingData, setLoadingData ] = useState(false);

    const fetchData = async () => {
        try {
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    useEffect(()=> {
        fetchData();
    }, [])

    const onFinish = async () => {

    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Enregistrer une demande</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={8}>
                            
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default DemandeVehiculeForm