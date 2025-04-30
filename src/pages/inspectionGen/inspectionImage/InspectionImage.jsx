import React, { useState } from 'react'
import { Form, Col, Upload, message, notification, Button } from 'antd';
import { UploadOutlined, MinusCircleOutlined  } from '@ant-design/icons';

const InspectionImage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState({});
    const [iconPositionsMap, setIconPositionsMap] = useState({});
    
    
    const handleImageUpload = (info, fieldName) => {
        const file = info.fileList[0]?.originFileObj;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImages(prev => ({ ...prev, [fieldName]: e.target.result }));
                setIconPositionsMap(prev => ({ ...prev, [fieldName]: [] })); // reset icons
            };
            reader.readAsDataURL(file);
        }
    };

    const onFinish = async () => {
        await form.validateFields();

    }



  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">FORM IMAGE</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Col xs={24} md={24}>
                        <Form.Item
                            label="Image"
                            name='img'
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e?.fileList) ? e.fileList : [])}
                            rules={[{ required: false, message: 'Veuillez télécharger une image' }]}
                        >
                            <Upload
                                name="img"
                                listType="picture"
                                beforeUpload={() => false}
                                onChange={(info) => handleImageUpload(info, name)}
                            >
                                <Button icon={<UploadOutlined />} className="custom-button">
                                    Télécharger une image
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Form>
            </div>
        </div>
    </>
  )
}

export default InspectionImage