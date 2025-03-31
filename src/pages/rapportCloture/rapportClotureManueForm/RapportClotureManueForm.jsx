import React, { useState } from 'react'
import { Button, Form, Input, notification, InputNumber, DatePicker, Modal, Select, Row, Col } from 'antd';

const RapportClotureManueForm = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [periode, setPeriode] = useState(null);
    

    const onFinish = () => {

    }

  return (
    <>
        <div className="client_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">Manuellement</h2>
            </div>
            <div className="client_wrapper">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>

                        <Col span={8}>
                            <Form.Item
                                label="Periode"
                                name="periode"
                                rules={[{ required: true, message: 'Veuillez entrer le nom du bâtiment!' }]}
                            >
                                <DatePicker
                                    picker="month"
                                    placeholder="Sélectionnez le mois"
                                    format="YYYY-MM-DD"
                                    style={{ width: '100%' }}
                                    onChange={(date, dateString) => setPeriode(dateString)}
                                />
                            </Form.Item>        
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="m2_occupe"
                                label="M² Occupé"
                                rules={[{ required: false, message: "Veuillez entrer la superficie occupée" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="M² Occupé" parser={(value) => value.replace(/\$\s?|(,*)/g, '')} />
                            </Form.Item>       
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="m2_facture"
                                label="M² Facturé"
                                rules={[{ required: false, message: "Veuillez entrer la superficie facturée" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="M² Facturé" parser={(value) => value.replace(/\$\s?|(,*)/g, '')} />
                            </Form.Item>    
                        </Col>

                        <Col span={8}>       
                            <Form.Item
                                name="total_manutation"
                                label="Total Manutention"
                                rules={[{ required: false, message: "Veuillez entrer le total" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Total" />
                            </Form.Item>         
                        </Col>

                        <Col span={8}>       
                            <Form.Item
                                name="total_entreposage"
                                label="Total entreposage"
                                rules={[{ required: false, message: "Veuillez entrer le total" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Total" />
                            </Form.Item>         
                        </Col>

                        <Col span={8}>       
                            <Form.Item
                                name="total"
                                label="Total"
                                rules={[{ required: false, message: "Veuillez entrer le total" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Total" />
                            </Form.Item>         
                        </Col>

                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default RapportClotureManueForm