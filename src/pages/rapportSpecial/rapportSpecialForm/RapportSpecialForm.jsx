import React from 'react'
import { Form, Col, Input,Row, InputNumber, Button, Select, DatePicker, notification, Tabs, Modal, Tooltip, Skeleton, Divider, message } from 'antd';

const RapportSpecialForm = () => {
    const [form] = Form.useForm();

  return (
    <>
        <div className="rapportSpecialForm">
            <Form
                form={form}
                name="declaration_form"
                layout="vertical"
            >
                <Row gutter={16}>
                    <Divider  style={{ fontSize:'16px', fontWeight:'600', color:'#1890ff', marginBottom :'16px', border:'1px solid #1890ff', borderRadius:'5px', padding:'4px'}} className='title_row' orientation="Center" plain>ENTREPOSAGE GLOBAL</Divider>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="superficie"
                            label="Superficie"
                            rules={[{ required: false, message: "Veuillez entrer la superficie" }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="Superficie" parser={(value) => value.replace(/\$\s?|(,*)/g, '')} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="entreposage"
                            label="Entreposage"
                            rules={[{ required: false, message: "Veuillez entrer l'Entreposage" }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="Entreposage" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    </>
  )
}

export default RapportSpecialForm