import React from 'react'
import { Form, Input, DatePicker, Row, Col } from 'antd';


const CarburantPriceForm = () => {
    const [form] = Form.useForm();

    const onFinish = () => {

    };

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>Ajouter un prix du carburant</h2>                
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="CDF"
                                name="prix_cdf"
                                rules={[{ required: true, message: 'Veuillez entrer le nom de département !' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="USD"
                                name="taux_usd"
                                rules={[{ required: true, message: 'Veuillez entrer le nom de département !' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Date effective"
                                name="date_effective"
                                rules={[{ required: true, message: 'Veuillez entrer le nom de département !' }]}
                            >
                                <DatePicker
                                    placeholder="Sélectionnez la date"
                                    format="YYYY-MM-DD"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default CarburantPriceForm