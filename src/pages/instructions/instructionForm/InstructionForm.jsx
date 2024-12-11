import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getCat_inspection, getInspectionOneV, getType_instruction, getType_photo, postInspection, putInspection } from '../../../services/batimentService';
import { getBatiment } from '../../../services/typeService';

const { TextArea } = Input;
const { Option } = Select;

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
  const [instructionData, setInstructionData] = useState([]);
  const [cat, setCat] = useState([]);
  const [typePhoto, setTypePhoto] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [iconPositions, setIconPositions] = useState([]);

  const fetchDataAll = async() => {
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

    uploadedFiles.forEach((file) => {
        formData.append('files', file);
    });

    try {
        if(idInspection){
            await putInspection(formData)
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été mise à jour avec succès.',
            });
        }
        else{
            await postInspection(formData);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
        }
        
        form.resetFields();
        closeModal();
        fetchData()
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
                {/* ID Bâtiment */}
                <Form.Item
                label="Bâtiment"
                name="id_batiment"
                rules={[{ required: false, message: 'Veuillez entrer l’ID du bâtiment' }]}
                >
                    <Select
                        showSearch
                        options={batiment.map((item) => ({
                                value: item.id_batiment,
                                label: item.nom_batiment,
                            }))}
                        placeholder="Sélectionnez un batiment..."
                        optionFilterProp="label"
                    />
                </Form.Item>

                {/* Commentaire */}
                <Form.Item
                label="Commentaire"
                name="commentaire"
                rules={[{ required: true, message: 'Veuillez entrer un commentaire' }]}
                >
                <TextArea rows={4} style={{resize:'none', height:'70px'}} placeholder="Entrez votre commentaire" />
                </Form.Item>


                {/* Catégorie d'instruction */}
                <Form.Item
                label="Catégorie d'Instruction"
                name="id_cat_instruction"
                rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
                >
                    <Select
                        showSearch
                        options={cat.map((item) => ({
                                value: item.id_cat_inspection,
                                label: item.nom_cat_inspection,
                            }))}
                        placeholder="Sélectionnez une categorie..."
                        optionFilterProp="label"
                    />
                </Form.Item>

                {/* Type instruction */}
                <Form.Item
                label="Type d'inspection"
                name="id_type_instruction"
                rules={[{ required: true, message: 'Veuillez sélectionner un type d inspection' }]}
                >
                    <Select 
                        showSearch
                        options={instructionData.map((item) => ({
                            value: item.id_type_instruction,
                            label: item.nom_type_instruction,
                        }))}
                        placeholder="Sélectionnez un type d inspection" 

                    />
                </Form.Item>

                <Form.Item
                label="Status"
                name="id_type_photo"
                rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
                >
                    <Select
                        showSearch
                        options={typePhoto.map((item) => ({
                                value: item.id_type_photo,
                                label: item.nom_type_photo,
                            }))}
                        placeholder="Sélectionnez un statut..."
                        optionFilterProp="label"
                    />
                </Form.Item>

                {/* Image Upload */}
                <Form.Item
                label="Image"
                name="img"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: 'Veuillez télécharger une image' }]}
                >
                    <Upload name="img" listType="picture" beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Télécharger une image</Button>
                    </Upload>
                </Form.Item>

                {/* Bouton de soumission */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
                        Soumettre
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
  );
};

export default InstructionForm;
