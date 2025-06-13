import { useEffect, useState } from 'react';
import { Form, Input, Select, Divider, Card, Upload, Button, notification, Row, Col, Skeleton } from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Rnd } from 'react-rnd';
import { getCat_inspection, getInspectionOneV, getType_instruction, getType_photo, postInspection, putInspection } from '../../../services/batimentService';
import { getBatiment } from '../../../services/typeService';
import './instructionForm.css'
import html2canvas from 'html2canvas';
const { TextArea } = Input;

const icons = [
    { id: 'danger', label: 'Danger', icon: '⚠️' },
    { id: 'arrow', label: 'Flèche', icon: '➡️' },
    { id: 'hammer', label: 'Marteau', icon: '🔨' },
    { id: 'water', label: 'Goutte d’eau', icon: '💧' },
  ];

const InstructionForm = ({idBatiment, closeModal, fetchData, idInspection, idTache}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [batiment, setBatiment] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [instructionData, setInstructionData] = useState([]);
  const [cat, setCat] = useState([]);
  const [typePhoto, setTypePhoto] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [iconPositions, setIconPositions] = useState([]);
  const [uploadedImages, setUploadedImages] = useState({});
  const [iconPositionsMap, setIconPositionsMap] = useState({});

  const fetchDataAll = async() => {
    setLoadingData(true);

    try {
        const [batimentData, typeInspe, inspectionData, typePhotoData] = await Promise.all([
            getBatiment(),
            getType_instruction(),
            getCat_inspection(),
            getType_photo()
        ])
        setBatiment(batimentData.data)
        setInstructionData(typeInspe.data)
        setCat(inspectionData.data)
        setTypePhoto(typePhotoData.data)
        if(idInspection){
            const { data: inspect} = await getInspectionOneV(idInspection);
            form.setFieldsValue({
                id_batiment: inspect[0].id_batiment,
                commentaire: inspect[0].commentaire,
                id_cat_instruction: inspect[0].id_cat_instruction,
                id_type_instruction: inspect[0].id_type_instruction,
            });
        }   
    } catch (error) {
        console.log(error)
    } finally {
        setLoadingData(false); 
    }
  }


useEffect(() => {
    fetchDataAll();
}, [form]);

const handleSubmit = async (values) => {
    setLoading(true);

    const uploadedFiles = values.img.map((file) => file.originFileObj);
    const formData = new FormData();
    formData.append('id_tache', idTache);
    formData.append('id_batiment', values.id_batiment);
    formData.append('commentaire', values.commentaire);
    formData.append('id_type_photo', values.id_type_photo);
    formData.append('id_cat_instruction', values.id_cat_instruction);
    formData.append('id_type_instruction', values.id_type_instruction);

/*     uploadedFiles.forEach((file) => {
        formData.append('files', file);
    }); */

      if (uploadedImage) {
        // Capture de l'image avec html2canvas
        const imageContainer = document.querySelector('.image-container');
        
        if (!imageContainer) {
            console.error("L'élément .image-container n'a pas été trouvé dans le DOM.");
            submitData(formData); // Soumettre les autres données sans image modifiée
            return;
        }

        html2canvas(imageContainer).then((canvas) => {
            const originalWidth = canvas.width;
            const originalHeight = canvas.height;
            
            let targetWidth = 500; // Nouvelle largeur souhaitée (en pixels)
            let targetHeight;

            if (originalWidth < targetWidth) {
                const ratio = targetWidth / originalWidth;
                targetHeight = originalHeight * ratio;
            } else {
                targetWidth = originalWidth;
                targetHeight = originalHeight;
            }

            const resizedCanvas = document.createElement('canvas');
            const ctx = resizedCanvas.getContext('2d');
            resizedCanvas.width = targetWidth;
            resizedCanvas.height = targetHeight;

            // Redessiner l'image redimensionnée sur le nouveau canvas
            ctx.drawImage(canvas, 0, 0, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight);

            // Convertir le canvas redimensionné en Blob
            resizedCanvas.toBlob((blob) => {
                const file = new File([blob], 'image_with_icons_resized.png', { type: 'image/png' });
                formData.append('files', file);
                
                // Soumission des données après avoir ajouté l'image redimensionnée
                submitData(formData);
            });
        });
    } else {
        submitData(formData);
    }
};


const submitData = async (formData) => {
    try {
        if (idInspection) {
            await putInspection(formData);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été mises à jour avec succès.',
            });
        } else {
            await postInspection(formData);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
        }

        form.resetFields();
        closeModal();
        fetchData();
    } catch (error) {
        console.error(error);
        notification.error({
            message: 'Erreur',
            description: "Une erreur s'est produite lors de l'enregistrement.",
        });
    } finally {
        setLoading(false);
    }
};

const addIconToField = (icon, fieldName) => {
    setIconPositionsMap(prev => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] || []), { icon, x: 0, y: 0, width: 50, height: 50 }]
    }));
};

const updateIconPosition = (fieldName, index, updatedPos) => {
    setIconPositionsMap(prev => {
        const updated = [...(prev[fieldName] || [])];
            updated[index] = { ...updated[index], ...updatedPos };
            return { ...prev, [fieldName]: updated };
    });
};
    

  const handleImageUpload = (info) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="controle_form">
        <div className="controle_title_rows">
            <h2 className="controle_h2">{ idInspection ? 'Modifier une inspection' : 'Insérer une inspection'}</h2>
        </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                    id_batiment: '',
                    commentaire: '',
                    id_cat_instruction: '',
                    id_type_photo: 1,
                    id_type_instruction: 1
                    }}
                >
                    <Card>
                        <Row gutter={12}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Bâtiment"
                                    name="id_batiment"
                                    rules={[{ required: false, message: 'Veuillez entrer l’ID du bâtiment' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> :
                                    <Select
                                        showSearch
                                        options={batiment.map((item) => ({
                                            value: item.id_batiment,
                                            label: item.nom_batiment,
                                        }))}
                                        placeholder="Sélectionnez un batiment..."
                                        optionFilterProp="label"
                                    />}
                                </Form.Item>
                            </Col>
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

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Type d'inspection"
                                    name="id_type_instruction"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un type d inspection' }]}
                                >
                                    {
                                        loadingData ? <Skeleton.Input active={true} /> : 
                                        <Select 
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

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Status"
                                    name="id_type_photo"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        showSearch
                                        options={typePhoto.map((item) => ({
                                                value: item.id_type_photo,
                                                label: item.nom_type_photo,
                                            }))}
                                        placeholder="Sélectionnez un statut..."
                                        optionFilterProp="label"
                                    />
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Form.List name='subData'>
                        {(fields, { add, remove }) => (
                            <>
                                <Divider className='title_row'>Image</Divider>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card style={{marginBottom:'10px'}}>
                                        <Row key={key} gutter={12} align="middle">
                                            <Col xs={24} md={11}>
                                                <Form.Item
                                                    label="Image"
                                                    name={[name, 'img']}
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
                                                {uploadedImages[name] && (
                                                    <div className="image-editor">
                                                        <div className="icon-toolbar">
                                                            {icons.map((icon) => (
                                                                <Button key={icon.id} onClick={() => addIconToField(icon.icon, name)}>
                                                                    {icon.icon} {icon.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                        <div className="image-container">
                                                            <img src={uploadedImages[name]} alt="Uploaded" className="uploaded-image" />
                                                            {(iconPositionsMap[name] || []).map((pos, index) => (
                                                                <Rnd
                                                                    key={index}
                                                                    bounds="parent"
                                                                    size={{ width: pos.width, height: pos.height }}
                                                                    position={{ x: pos.x, y: pos.y }}
                                                                    onDragStop={(e, d) => updateIconPosition(name, index, { x: d.x, y: d.y })}
                                                                    onResizeStop={(e, direction, ref, delta, position) =>
                                                                        updateIconPosition(name, index, {
                                                                            width: ref.offsetWidth,
                                                                            height: ref.offsetHeight,
                                                                            ...position,
                                                                        })
                                                                    }
                                                                >
                                                                    <div style={{
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

                                            <Col xs={24} md={11}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'commentaire']}
                                                    label="Commentaire"
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message: 'Veuillez fournir un commentaire...',
                                                        }
                                                    ]}
                                                >
                                                    {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'50px'}}/>}
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={2}>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<MinusCircleOutlined />}
                                                    onClick={() => {
                                                    remove(name);
                                            
                                                    setUploadedImages(prev => {
                                                        const newState = { ...prev };
                                                            delete newState[name];
                                                            return newState;
                                                    });
                                            
                                                    setIconPositionsMap(prev => {
                                                        const newState = { ...prev };
                                                        delete newState[name];
                                                        return newState;
                                                        });
                                                    }}
                                                >
                                                    </Button>
                                            </Col>

                                        </Row>
                                    </Card>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusCircleOutlined />}
                                        style={{ width: '100%' }}
                                    >
                                        Ajouter l'image
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Col xs={24} md={12}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={loading} loading={loading} style={{marginTop:'10px'}}>
                                Soumettre
                            </Button>
                        </Form.Item>
                    </Col>
                </Form>
            </div>
    </div>
  );
};

export default InstructionForm;
