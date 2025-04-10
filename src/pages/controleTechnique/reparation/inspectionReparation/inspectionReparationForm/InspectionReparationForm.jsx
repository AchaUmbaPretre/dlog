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
    const [loadingData, setLoadingData] = useState(false);
    const [instructionData, setInstructionData] = useState([]);
    const [cat, setCat] = useState([]);
    const [typePhoto, setTypePhoto] = useState([]);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [iconPositions, setIconPositions] = useState([]);
    const canvasRef = useRef(null);
    const [fileList, setFileList] = useState([]);

    const handleSubmit = async (values) => {

    }

    const handleImageUpload = (info) => {
        const file = info.fileList[0]?.originFileObj;
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => setUploadedImage(e.target.result);
          reader.readAsDataURL(file);
        }

        setFileList(info.fileList.slice(-1));
      };

    const addIcon = (icon) => {
        setIconPositions([...iconPositions, { icon, x: 50, y: 50, width: 50, height: 50 }]);
      };

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
                        id_cat_instruction: ''               }}
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
                                    allowClear
                                    showSearch
                                    options={cat.map((item) => ({
                                            value: item.id_cat_inspection,
                                            label: item.nom_cat_inspection,
                                        }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez une categorie..."
                                    size='large'
                                /> }
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Type d'inspection"
                                name="id_type_instruction"
                                rules={[{ required: true, message: 'Veuillez sélectionner un type d inspection' }]}
                            >
                                {
                                    loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select 
                                        allowClear
                                        size='large'
                                        showSearch
                                        options={instructionData.map((item) => ({
                                            value: item.id_type_instruction,
                                            label: item.nom_type_instruction,
                                        }))}
                                    placeholder="Sélectionnez un type d inspection" 
                                />
                                }
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24}>
                            <Form.Item
                                label="Commentaire"
                                name="commentaire"
                                rules={[{ required: true, message: 'Veuillez entrer un commentaire' }]}
                            >
                                <TextArea rows={4} style={{resize:'none', height:'70px'}} placeholder="Entrez votre commentaire" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24}>
                            <Form.Item
                                label="Image"
                                name="img"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                                rules={[{ required: true, message: 'Veuillez télécharger une image' }]}
                            >
                                <Upload 
                                    name="img" 
                                    accept="image/*"
                                    listType="picture-card"
                                    beforeUpload={() => false} 
                                    onChange={handleImageUpload}
                                    maxCount={1}
                                >
                                    {fileList.length < 1 && (
                                        <Button icon={<UploadOutlined style={{ margin: 0 }} />} />
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>

                        {uploadedImage && (
                            <div className="image-editor">
                                <div className="icon-toolbar">
                                    {icons.map((icon) => (
                                    <Button key={icon.id} onClick={() => addIcon(icon.icon)}>
                                        {icon.icon} {icon.label}
                                    </Button>
                                    ))}
                                </div>
                                <div className="image-container">
                                    <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
                                        {iconPositions.map((pos, index) => (
                                            <Rnd
                                                key={index}
                                                    bounds="parent"
                                                    size={{ width: pos.width, height: pos.height }}
                                                        position={{ x: pos.x, y: pos.y }}
                                                        onDragStop={(e, d) => {
                                                        const updatedIcons = [...iconPositions];
                                                        updatedIcons[index] = { ...updatedIcons[index], x: d.x, y: d.y };
                                                        setIconPositions(updatedIcons);
                                                        }}
                                                        onResizeStop={(e, direction, ref, delta, position) => {
                                                        const updatedIcons = [...iconPositions];
                                                        updatedIcons[index] = {
                                                            ...updatedIcons[index],
                                                            width: ref.offsetWidth,
                                                            height: ref.offsetHeight,
                                                            ...position,
                                                        };
                                                        setIconPositions(updatedIcons);
                                                        }}
                                                    >
                                            <div
                                                style={{
                                                    fontSize: '30px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    height: '100%',
                                                    cursor: 'move',
                                                }}
                                            >
                                                {pos.icon}
                                            </div>
                                        </Rnd>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Col xs={24} md={12}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
                                    Soumettre
                                </Button>
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