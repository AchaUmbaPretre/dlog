import { useState } from 'react'
import { Col, Card, Space, Form, Upload, Input, notification, Row, Select, Skeleton, Button, Divider, message, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import getCroppedImg from '../../../../utils/getCroppedImg';
import Cropper from 'react-easy-crop';
import { postSociete } from '../../../../services/userService';

const ParametreSocieteForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
            if (fileList.length > 0) {
              setPreviewImage(URL.createObjectURL(fileList[0].originFileObj));
              setCropping(true);
            }
    };
        
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };
        
    const handleCrop = async () => {
        try {
            const cropped = await getCroppedImg(previewImage, croppedAreaPixels);
            const croppedFile = new File(
                [await fetch(cropped).then((r) => r.blob())],
                    'cropped-image.jpg',
                    { type: 'image/jpeg' }
                );
        
                setFileList([
                    {
                        uid: '-1',
                        name: 'cropped-image.jpg',
                        status: 'done',
                        url: cropped,
                        originFileObj: croppedFile,
                    },
                ]);
        
                setCropping(false);
        } catch (e) {
            console.error('Error cropping image:', e);
        }
    };
    

    const onFinish = async(values) => {
        setLoading(true)

        try {
            await postSociete(values);
            notification.success({
                message: 'Succès',
                description: 'La société a été enregistrée avec succès.',
            });

        } catch (error) {
            
        }
    }


  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">ENREGISTRER UNE SOCIETE</h2>
            </div>
            <div className="controle_wrapper">
                <Card>
                    <Form
                        form={form}
                        name="chauffeurForm"
                        layout="vertical"
                        autoComplete="off"
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
                                    <Upload  
                                        accept="image/*"
                                        listType="picture-card"
                                        onChange={handleUploadChange}
                                        beforeUpload={() => false} 
                                    >
                                        <Button icon={<UploadOutlined style={{margin:0}} />}></Button>
                                    </Upload>
                                </Form.Item>
                            </Col>

                            <Col xs={24}>
                                <Form.Item>
                                    <Space className="button-group">
                                        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                                            {'Ajouter'}
                                        </Button>
                                        <Button htmlType="reset">
                                            Réinitialiser
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        </div>

        <Modal
            visible={cropping}
            title="Rogner l'image"
            onCancel={() => setCropping(false)}
            onOk={handleCrop}
            okText="Rogner"
            cancelText="Annuler"
            width={800}
        >
            <div style={{ position: 'relative', height: 400 }}>
                <Cropper
                    image={previewImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
        </Modal>
    </>
  )
}

export default ParametreSocieteForm