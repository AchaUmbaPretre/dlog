import { useEffect, useRef, useState } from 'react';
import { Form, Input, Select, Upload, Button, notification, Row, Col, Skeleton } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
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


const addIcon = (icon) => {
    setIconPositions([...iconPositions, { icon, x: 50, y: 50, width: 50, height: 50 }]);
  };

  const moveIcon = (index, x, y) => {
    const updatedIcons = [...iconPositions];
    updatedIcons[index] = { ...updatedIcons[index], x, y };
    setIconPositions(updatedIcons);
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

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Commentaire"
                            name="commentaire"
                            rules={[{ required: true, message: 'Veuillez entrer un commentaire' }]}
                        >
                        <TextArea rows={4} style={{resize:'none', height:'70px'}} placeholder="Entrez votre commentaire" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Image"
                            name="img"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                            rules={[{ required: true, message: 'Veuillez télécharger une image' }]}
                        >
                            <Upload name="img" listType="picture" beforeUpload={() => false} onChange={handleImageUpload}>
                                <Button icon={<UploadOutlined />}  className="custom-button">Télécharger une image</Button>
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
  );
};

export default InstructionForm;
