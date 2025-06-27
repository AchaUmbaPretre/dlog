import React from 'react'
import { Col, DatePicker, Form, notification, Input, InputNumber, Row, Select, Skeleton, Button, Divider, message } from 'antd';

const ParametreSocieteForm = () => {
    const [form] = Form.useForm();

    const onFinish = async() => {

    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">ENREGISTRER UNE SOCIETE</h2>
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
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="nom_societe"
                                label="Nom"
                                rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir une nom...',
                                        }
                                    ]}
                            >
                                <Input size='large' placeholder="Saisir le nom de société..." style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="adresse"
                                label="Adresse"
                                rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir une adresse...',
                                        }
                                    ]}
                            >
                                <Input size='large' placeholder="Saisir l'adresse " style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="rccm"
                                label="Rccm"
                            >
                                <Input size='large' placeholder="CD/KNG/RCCM/13-B-192..." style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="nif"
                                label="Nif"
                            >
                                <Input size='large' placeholder="B0600029R" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="tel"
                                label="Tél"
                            >
                                <Input size='large' placeholder="+243" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="email"
                                label="Email"
                            >
                                <Input size='large' placeholder="xxx@gmail.com" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="logo"
                                label="Logo"
                            >
                                <Input size='large' placeholder="xxx@gmail.com" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default ParametreSocieteForm