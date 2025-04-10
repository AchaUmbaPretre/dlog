import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Select, Upload, Button, notification, Row, Col, Skeleton } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Rnd } from 'react-rnd';
import html2canvas from 'html2canvas';
const { TextArea } = Input;

const icons = [
    { id: 'danger', label: 'Danger', icon: '⚠️' },
    { id: 'arrow', label: 'Flèche', icon: '➡️' },
    { id: 'hammer', label: 'Marteau', icon: '🔨' },
    { id: 'water', label: 'Goutte d’eau', icon: '💧' },
  ];

const InspectionReparationForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [batiment, setBatiment] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [instructionData, setInstructionData] = useState([]);
    const [cat, setCat] = useState([]);
    const [typePhoto, setTypePhoto] = useState([]);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [iconPositions, setIconPositions] = useState([]);
    const canvasRef = useRef(null);

    const handleSubmit = async (values) => {

    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Form inspection</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        commentaire: '',
                        id_cat_instruction: '',
                        id_type_photo: 1,
                        id_type_instruction: 1
                    }}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Catégorie d'Instruction"
                                name="id_cat_instruction"
                                rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
                            >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    showSearch
                                    options={cat.map((item) => ({
                                            value: item.id_cat_inspection,
                                            label: item.nom_cat_inspection,
                                        }))}
                                    placeholder="Sélectionnez une categorie..."
                                    optionFilterProp="label"
                                /> }
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default InspectionReparationForm