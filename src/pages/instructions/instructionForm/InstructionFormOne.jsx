import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getType_instruction, postInspection } from '../../../services/batimentService';

const { TextArea } = Input;
const { Option } = Select;

const InstructionFormOne = ({idBatiment, closeModal, fetchData}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [instructionData, setInstructionData] = useState([]);

  const fetchDataAll = async() => {
    setLoading(true)

    try{
        const [typeInspe] = await Promise.all([
            getType_instruction()
        ]);

        setInstructionData(typeInspe.data)

    } catch (error){
        console.log(error)

    }finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    form.resetFields();
    fetchDataAll();
  }, [idBatiment,form]);

  const handleSubmit = async (values) => {
    setLoading(true);

    const uploadedFiles = values.img.map((file) => file.originFileObj);

    const formData = new FormData();
    formData.append('id_batiment', idBatiment);
    formData.append('commentaire', values.commentaire);
    formData.append('id_cat_instruction', values.id_cat_instruction);
    formData.append('id_type_instruction', values.id_type_instruction);

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
            <h2 className="controle_h2">Insérer une inspection</h2>
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
                id_type_instruction: 1
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

                {/* Catégorie d'instruction */}
                <Form.Item
                label="Catégorie d'Inspection"
                name="id_cat_instruction"
                rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
                >
                <Select placeholder="Sélectionnez une catégorie">
                    <Option value={1}>Catégorie 1</Option>
                    <Option value={2}>Catégorie 2</Option>
                    <Option value={3}>Catégorie 3</Option>
                </Select>
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

export default InstructionFormOne;
