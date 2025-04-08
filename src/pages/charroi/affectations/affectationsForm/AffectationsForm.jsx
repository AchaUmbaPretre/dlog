import React from 'react'
import { Form, Input, Skeleton, Row, Col, Modal, Select } from 'antd';

const { Option } = Select;


const AffectationsForm = () => {
    const [form] = Form.useForm();
    
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
                            {loading ? <Skeleton.Input active /> : <Input placeholder="Entrez le titre du projet" />}
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
                            label="Site"
                            name="id_site"
                            rules={[{ required: true, message: 'Le site est requis' }]}
                        >
                            {loading ? <Skeleton.Input active /> : <Input.TextArea placeholder="Saisir l'adresse...." style={{height:"80px", resize:'none'}} />}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            </div>
        </div>
    </>
  )
}

export default AffectationsForm