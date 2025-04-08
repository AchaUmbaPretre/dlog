import React, { useState } from 'react'
import { Form, Input, Skeleton, Row, Col, Button, Select } from 'antd';

const { Option } = Select;


const AffectationsForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    

    const onFinish = async (values) => {
        try {
            
        } catch (error) {
            
        }
    }
    
  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>Créer une affectation</h2>                
            </div>
            <div className="controle_wrapper">
                <Form 
                    layout="vertical" 
                    onFinish={onFinish} 
                    form={form} 
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Chauffeur"
                                name="id_chauffeur"
                                rules={[{ required: true, message: 'Le nom est requis' }]}
                            >
                                {loading ? <Skeleton.Input active /> : <Input placeholder="Selectionnez un chauffeur..." />}
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Site"
                                name="id_site"
                                rules={[{ required: true, message: 'Le site est requis' }]}
                            >
                                {loading ? <Skeleton.Input active /> : <Input placeholder="Entrez le site..." />}
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: false, message: 'Le site est requis' }]}
                            >
                                {loading ? <Skeleton.Input active /> : <Input.TextArea placeholder="Saisir la description..." style={{height:"80px", resize:'none'}} />}
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

export default AffectationsForm