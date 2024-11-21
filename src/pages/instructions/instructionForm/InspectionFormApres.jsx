import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getType_instruction, getType_photo, postInspection } from '../../../services/batimentService';
import { getBatimentOne } from '../../../services/typeService';

const { TextArea } = Input;
const { Option } = Select;

const InstructionFormApres = ({closeModal, fetchData, idInspection}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [instructionData, setInstructionData] = useState([]);
  const [nameBatiment, setNameBatiment] = useState('');
  const [typePhoto, setTypePhoto] = useState([])



  const fetchDataAll = async() => {
    setLoading(true)

    try{
        const [typeInspe, typePhotoData] = await Promise.all([
            getType_instruction(),
            getType_photo()
        ]);
        setInstructionData(typeInspe.data)
        setTypePhoto(typePhotoData.data)

    } catch (error){
        console.log(error)

    }finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    form.resetFields();
    fetchDataAll();
  }, [idInspection,form]);

  const handleSubmit = async (values) => {
    setLoading(true);

    const uploadedFiles = values.img.map((file) => file.originFileObj);

    const formData = new FormData();
    formData.append('id_inspection', idInspection);
    formData.append('commentaire', values.commentaire);
    formData.append('id_type_photo', values.id_type_photo);
    uploadedFiles.forEach((file) => {
        formData.append('files', file);
    });

    try {
        await postInspection(formData);
        notification.success({
            message: 'Succès',
            description: 'Les informations ont été enregistrées avec succès.',
        });
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
            <h2 className="controle_h2">Insérer une inspection Apres</h2>
        </div>
        <div className="controle_wrapper">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                id_batiment: '',
                commentaire: '',
                id_type_photo: 2,
                }}
            >
                {/* Commentaire */}
                <Form.Item
                label="Commentaire"
                name="commentaire"
                rules={[{ required: true, message: 'Veuillez entrer un commentaire' }]}
                >
                    <TextArea rows={4} placeholder="Entrez votre commentaire" />
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

export default InstructionFormApres;
